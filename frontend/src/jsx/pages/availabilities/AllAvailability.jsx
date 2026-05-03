import React, { useState, useRef, useEffect, useMemo } from "react";
import { Dropdown, Row, Nav, Tab, Card, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import PageTitle from "../../layouts/PageTitle";
import {
  getAvailabilities,
  deleteAvailability,
} from "../../../services/availabilityService";
import { getTeachers } from "../../../services/teacherService";
import { dayLabel } from "./availabilityValidation";

const theadData = [
  { heading: "Docente", sortingVale: "teacher", coordOnly: true },
  { heading: "Día", sortingVale: "dayOfWeek" },
  { heading: "Hora inicio", sortingVale: "startTime" },
  { heading: "Hora fin", sortingVale: "endTime" },
  { heading: "Disponible", sortingVale: "isAvailable" },
  { heading: "Acciones", sortingVale: "actions" },
];

const trimTime = (value) => {
  if (typeof value !== "string") return "";
  const [hh = "", mm = ""] = value.split(":");
  if (!hh || !mm) return "";
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
};

const useCurrentTeacherContext = () => {
  const [ctx, setCtx] = useState({
    isCoordinator: true,
    currentTeacherDocumentId: null,
    currentTeacherLabel: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      let role = "";
      let email = "";
      try {
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        role = userDetails?.role || "";
        email = userDetails?.email || "";
      } catch {
        role = "";
      }

      if (role === "teacher") {
        try {
          const teachers = await getTeachers();
          const own = (teachers || []).find(
            (t) => (t.email || "").toLowerCase() === email.toLowerCase()
          );

          if (cancelled) return;

          if (own?.documentId) {
            setCtx({
              isCoordinator: false,
              currentTeacherDocumentId: own.documentId,
              currentTeacherLabel: `${own.firstName} ${own.lastName}`,
              loading: false,
            });
            return;
          }
        } catch (err) {
          console.error("No se pudo resolver el docente actual", err);
        }
      }

      if (!cancelled) {
        setCtx({
          isCoordinator: true,
          currentTeacherDocumentId: null,
          currentTeacherLabel: null,
          loading: false,
        });
      }
    };

    resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  return ctx;
};

const buildCalendarEvents = (availabilities) => {
  if (!Array.isArray(availabilities)) return [];

  const today = new Date();
  const dayIndex = today.getDay();
  const monday = new Date(today);
  const offsetToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;
  monday.setDate(today.getDate() + offsetToMonday);
  monday.setHours(0, 0, 0, 0);

  return availabilities
    .filter((a) => a && a.dayOfWeek && a.startTime && a.endTime)
    .map((a) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + (Number(a.dayOfWeek) - 1));
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dayString = `${yyyy}-${mm}-${dd}`;
      const start = trimTime(a.startTime) || "00:00";
      const end = trimTime(a.endTime) || "00:00";

      const teacherName = a.teacher
        ? `${a.teacher.firstName || ""} ${a.teacher.lastName || ""}`.trim()
        : "";

      return {
        id: a.documentId,
        title: a.isAvailable
          ? teacherName || "Disponible"
          : `${teacherName || "No disponible"} (no disp.)`,
        start: `${dayString}T${start}:00`,
        end: `${dayString}T${end}:00`,
        backgroundColor: a.isAvailable ? "#2bc155" : "#9ca3af",
        borderColor: a.isAvailable ? "#2bc155" : "#9ca3af",
        extendedProps: { documentId: a.documentId },
      };
    });
};

const AllAvailability = () => {
  const navigate = useNavigate();
  const teacherCtx = useCurrentTeacherContext();

  const [sort, setSort] = useState(10);
  const [feeData, setFeeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [iconData, setIconDate] = useState({ complete: false, ind: Number });

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const activePag = useRef(0);
  const [test, settest] = useState(0);

  const teacherOptions = useMemo(
    () => [
      { value: "", label: "Todos los docentes" },
      ...teachers.map((t) => ({
        value: t.documentId,
        label: `${t.firstName} ${t.lastName}`,
      })),
    ],
    [teachers]
  );

  const fetchTeachers = async () => {
    try {
      const res = await getTeachers();
      setTeachers(res || []);
    } catch (err) {
      console.error("Error fetching teachers", err);
    }
  };

  const fetchAvailabilities = async (teacherDocumentId) => {
    try {
      const res = await getAvailabilities({ teacherDocumentId });

      const formatted = (res || []).map((a) => ({
        id: a.id,
        documentId: a.documentId,
        dayOfWeek: a.dayOfWeek,
        dayLabel: dayLabel(a.dayOfWeek),
        startTime: trimTime(a.startTime),
        endTime: trimTime(a.endTime),
        isAvailable: a.isAvailable,
        teacherName: a.teacher
          ? `${a.teacher.firstName || ""} ${a.teacher.lastName || ""}`.trim()
          : "—",
        teacherDocumentId: a.teacher?.documentId || null,
        raw: a,
      }));

      setFeeData(formatted);
      setOriginalData(formatted);
    } catch (err) {
      console.error("Error fetching availabilities", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo cargar la disponibilidad",
      });
    }
  };

  useEffect(() => {
    if (teacherCtx.loading) return;

    if (teacherCtx.isCoordinator) {
      fetchTeachers();
      fetchAvailabilities();
    } else {
      fetchAvailabilities(teacherCtx.currentTeacherDocumentId);
    }
  }, [teacherCtx.loading, teacherCtx.isCoordinator, teacherCtx.currentTeacherDocumentId]);

  const onTeacherChange = (option) => {
    setSelectedTeacher(option);
    fetchAvailabilities(option?.value || undefined);
  };

  const chageData = (frist, sec) => {
    const table = document.querySelectorAll("#availabilityList tbody tr");
    for (let i = 0; i < table.length; ++i) {
      if (i >= frist && i < sec) {
        table[i].classList.remove("d-none");
      } else {
        table[i].classList.add("d-none");
      }
    }
  };

  useEffect(() => {
    setData(document.querySelectorAll("#availabilityList tbody tr"));
  }, [test, feeData]);

  activePag.current === 0 && chageData(0, sort);

  const paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };

  const SotingData = (name) => {
    const sorted = [...feeData];

    if (name === "dayOfWeek") {
      sorted.sort((a, b) =>
        iconData.complete ? a.dayOfWeek - b.dayOfWeek : b.dayOfWeek - a.dayOfWeek
      );
    } else if (name === "startTime") {
      sorted.sort((a, b) =>
        iconData.complete
          ? a.startTime.localeCompare(b.startTime)
          : b.startTime.localeCompare(a.startTime)
      );
    } else if (name === "teacher") {
      sorted.sort((a, b) =>
        iconData.complete
          ? a.teacherName.localeCompare(b.teacherName)
          : b.teacherName.localeCompare(a.teacherName)
      );
    }

    setFeeData(sorted);
  };

  const DataSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = originalData.filter((item) =>
      `${item.teacherName} ${item.dayLabel} ${item.startTime} ${item.endTime}`
        .toLowerCase()
        .includes(term)
    );
    setFeeData(filtered);
  };

  const handleDelete = async (documentId) => {
    const result = await Swal.fire({
      title: "¿Eliminar disponibilidad?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAvailability(documentId);
      const teacherFilter = teacherCtx.isCoordinator
        ? selectedTeacher?.value || undefined
        : teacherCtx.currentTeacherDocumentId;
      await fetchAvailabilities(teacherFilter);
      Swal.fire("Eliminada", "La disponibilidad fue eliminada.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo eliminar",
      });
    }
  };

  const buildAddUrl = () => {
    const params = new URLSearchParams();
    if (teacherCtx.isCoordinator && selectedTeacher?.value) {
      params.set("teacher", selectedTeacher.value);
    }
    const qs = params.toString();
    return qs ? `/add-availability?${qs}` : "/add-availability";
  };

  const calendarEvents = useMemo(
    () => buildCalendarEvents((feeData || []).map((row) => row.raw)),
    [feeData]
  );

  const handleCalendarSelect = (selectInfo) => {
    const start = selectInfo.start;
    const end = selectInfo.end;

    const day = start.getDay() === 0 ? 6 : start.getDay();

    const params = new URLSearchParams();
    params.set("day", String(day));
    params.set(
      "start",
      `${String(start.getHours()).padStart(2, "0")}:${String(
        start.getMinutes()
      ).padStart(2, "0")}`
    );
    params.set(
      "end",
      `${String(end.getHours()).padStart(2, "0")}:${String(
        end.getMinutes()
      ).padStart(2, "0")}`
    );
    if (teacherCtx.isCoordinator && selectedTeacher?.value) {
      params.set("teacher", selectedTeacher.value);
    }

    navigate(`/add-availability?${params.toString()}`);
  };

  const handleCalendarEventClick = (clickInfo) => {
    const documentId =
      clickInfo.event.extendedProps?.documentId || clickInfo.event.id;
    if (documentId) {
      navigate(`/edit-availability/${documentId}`);
    }
  };

  const visibleHead = theadData.filter(
    (item) => !item.coordOnly || teacherCtx.isCoordinator
  );

  return (
    <>
      <PageTitle activeMenu={"All Availabilities"} motherMenu={"Availability"} />
      <Row>
        <Tab.Container defaultActiveKey={"List"}>
          <div className="col-lg-12">
            <Nav as="ul" className="nav nav-pills mb-3">
              <Nav.Item as="li">
                <Nav.Link eventKey="List" className="me-1">
                  List View
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="Calendar">Calendar View</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {teacherCtx.isCoordinator && (
            <div className="col-lg-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <label className="form-label">Filtrar por docente</label>
                  <Select
                    isClearable
                    isSearchable
                    options={teacherOptions}
                    value={selectedTeacher}
                    onChange={onTeacherChange}
                    placeholder="Todos los docentes"
                    className="custom-react-select"
                  />
                </div>
              </div>
            </div>
          )}

          {!teacherCtx.isCoordinator && teacherCtx.currentTeacherLabel && (
            <div className="col-lg-12 mb-3">
              <div className="alert alert-info">
                Mostrando la disponibilidad de{" "}
                <strong>{teacherCtx.currentTeacherLabel}</strong>.
              </div>
            </div>
          )}

          <div className="col-lg-12">
            <Tab.Content className="row">
              {/* ================= LIST VIEW ================= */}
              <Tab.Pane eventKey="List" className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Rangos de disponibilidad</h4>
                    <Link to={buildAddUrl()} className="btn btn-primary">
                      + Add New
                    </Link>
                  </div>

                  <div className="card-body">
                    <div className="table-responsive">
                      <div
                        id="availabilityList"
                        className="dataTables_wrapper no-footer"
                      >
                        <div className="justify-content-between d-sm-flex">
                          <div className="dataTables_length">
                            <label className="d-flex align-items-center">
                              Show
                              <Dropdown className="search-drop">
                                <Dropdown.Toggle as="div">{sort}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => setSort(10)}>
                                    10
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => setSort(20)}>
                                    20
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => setSort(30)}>
                                    30
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              entries
                            </label>
                          </div>

                          <div className="dataTables_filter">
                            <label>
                              Search:
                              <input type="search" onChange={DataSearch} />
                            </label>
                          </div>
                        </div>

                        <table className="display dataTable no-footer w-100">
                          <thead>
                            <tr>
                              {visibleHead.map((item, ind) => (
                                <th
                                  key={ind}
                                  onClick={() => {
                                    SotingData(item.sortingVale);
                                    setIconDate((prev) => ({
                                      complete: !prev.complete,
                                      ind,
                                    }));
                                  }}
                                >
                                  {item.heading}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {feeData.map((row, ind) => (
                              <tr key={ind}>
                                {teacherCtx.isCoordinator && (
                                  <td>{row.teacherName}</td>
                                )}
                                <td>{row.dayLabel}</td>
                                <td>{row.startTime}</td>
                                <td>{row.endTime}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      row.isAvailable
                                        ? "bg-success"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    {row.isAvailable ? "Sí" : "No"}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/edit-availability/${row.documentId}`}
                                    className="btn btn-xs sharp btn-primary me-1"
                                  >
                                    <i className="fa fa-pencil" />
                                  </Link>
                                  <button
                                    className="btn btn-xs sharp btn-danger"
                                    onClick={() =>
                                      handleDelete(row.documentId)
                                    }
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {feeData.length === 0 && (
                              <tr>
                                <td
                                  colSpan={visibleHead.length}
                                  className="text-center"
                                >
                                  No hay rangos de disponibilidad registrados.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                          <div className="dataTables_info">
                            Showing {activePag.current * sort + 1} to{" "}
                            {data.length > (activePag.current + 1) * sort
                              ? (activePag.current + 1) * sort
                              : data.length}{" "}
                            of {data.length} entries
                          </div>

                          <div
                            className="dataTables_paginate paging_simple_numbers"
                            id="example5_paginate"
                          >
                            <Link
                              className="paginate_button previous disabled"
                              to="#"
                              onClick={() =>
                                activePag.current > 0 &&
                                onClick(activePag.current - 1)
                              }
                            >
                              Previous
                            </Link>

                            <span>
                              {paggination.map((number, i) => (
                                <Link
                                  key={i}
                                  to="#"
                                  className={`paginate_button ${
                                    activePag.current === i ? "current" : ""
                                  }`}
                                  onClick={() => onClick(i)}
                                >
                                  {number}
                                </Link>
                              ))}
                            </span>

                            <Link
                              className="paginate_button next"
                              to="#"
                              onClick={() =>
                                activePag.current + 1 < paggination.length &&
                                onClick(activePag.current + 1)
                              }
                            >
                              Next
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* ================= CALENDAR VIEW ================= */}
              <Tab.Pane eventKey="Calendar" className="col-lg-12">
                <Row>
                  <Col xl={12}>
                    <Card>
                      <div className="card-header">
                        <h4 className="card-title">Calendario semanal</h4>
                        <Link to={buildAddUrl()} className="btn btn-primary">
                          + Add New
                        </Link>
                      </div>
                      <Card.Body>
                        <p className="text-muted mb-2">
                          Haz click y arrastra sobre la rejilla para crear un
                          rango. Click sobre un evento para editarlo.
                        </p>
                        <div className="demo-app-calendar" id="availabilityCalendar">
                          <FullCalendar
                            plugins={[timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                              start: "",
                              center: "",
                              end: "",
                            }}
                            dayHeaderFormat={{ weekday: "long" }}
                            allDaySlot={false}
                            slotMinTime="06:00:00"
                            slotMaxTime="22:00:00"
                            slotDuration="00:30:00"
                            hiddenDays={[0]}
                            firstDay={1}
                            locale="es"
                            height="auto"
                            selectable={true}
                            selectMirror={true}
                            select={handleCalendarSelect}
                            eventClick={handleCalendarEventClick}
                            events={calendarEvents}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </Row>
    </>
  );
};

export default AllAvailability;
