import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";

import PageTitle from "../../layouts/PageTitle";
import {
  getAvailabilities,
  createAvailability,
} from "../../../services/availabilityService";
import { getTeachers } from "../../../services/teacherService";
import {
  DAYS_OF_WEEK,
  validateRange,
  findOverlap,
  formatTime,
  dayLabel,
} from "./availabilityValidation";

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

const AddAvailability = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teacherCtx = useCurrentTeacherContext();

  const [teachers, setTeachers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const prefill = useMemo(
    () => ({
      day: searchParams.get("day"),
      start: searchParams.get("start"),
      end: searchParams.get("end"),
      teacher: searchParams.get("teacher"),
    }),
    [searchParams]
  );

  const [formData, setFormData] = useState({
    dayOfWeek: prefill.day ? Number(prefill.day) : 1,
    startTime: prefill.start ? formatTime(prefill.start) : "08:00",
    endTime: prefill.end ? formatTime(prefill.end) : "10:00",
    isAvailable: true,
    teacherDocumentId: prefill.teacher || "",
  });

  useEffect(() => {
    if (teacherCtx.loading) return;

    if (teacherCtx.isCoordinator) {
      getTeachers()
        .then((res) => setTeachers(res || []))
        .catch((err) => console.error("Error fetching teachers", err));
    } else {
      setFormData((prev) => ({
        ...prev,
        teacherDocumentId: teacherCtx.currentTeacherDocumentId || "",
      }));
    }
  }, [teacherCtx.loading, teacherCtx.isCoordinator, teacherCtx.currentTeacherDocumentId]);

  const teacherOptions = useMemo(
    () =>
      teachers.map((t) => ({
        value: t.documentId,
        label: `${t.firstName} ${t.lastName}`,
      })),
    [teachers]
  );

  const dayOptions = DAYS_OF_WEEK;

  const selectedDay = useMemo(
    () => dayOptions.find((d) => d.value === Number(formData.dayOfWeek)) || null,
    [dayOptions, formData.dayOfWeek]
  );

  const selectedTeacher = useMemo(
    () =>
      teacherOptions.find((t) => t.value === formData.teacherDocumentId) || null,
    [teacherOptions, formData.teacherDocumentId]
  );

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.teacherDocumentId) {
      Swal.fire({
        icon: "error",
        title: "Falta el docente",
        text: "Selecciona un docente antes de continuar.",
      });
      return;
    }

    const errors = validateRange({
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
    });

    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Rango inválido",
        text: errors[0],
      });
      return;
    }

    setSubmitting(true);
    try {
      const existing = await getAvailabilities({
        teacherDocumentId: formData.teacherDocumentId,
      });

      const overlap = findOverlap(
        {
          dayOfWeek: formData.dayOfWeek,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        existing
      );

      if (overlap) {
        Swal.fire({
          icon: "error",
          title: "Solapamiento detectado",
          text: `El docente ya tiene un rango el ${dayLabel(
            overlap.dayOfWeek
          )} entre ${formatTime(overlap.startTime)} y ${formatTime(
            overlap.endTime
          )}.`,
        });
        setSubmitting(false);
        return;
      }

      await createAvailability({
        dayOfWeek: Number(formData.dayOfWeek),
        startTime: formData.startTime,
        endTime: formData.endTime,
        isAvailable: !!formData.isAvailable,
        teacherDocumentId: formData.teacherDocumentId,
      });

      await Swal.fire({
        icon: "success",
        title: "Disponibilidad creada",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/all-availability");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo crear la disponibilidad",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (teacherCtx.loading) return <p>Cargando...</p>;

  return (
    <>
      <PageTitle activeMenu={"Add Availability"} motherMenu={"Availability"} />
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Nuevo rango de disponibilidad</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} id="addAvailabilityForm">
                <div className="row">
                  {teacherCtx.isCoordinator && (
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label">Docente</label>
                        <Select
                          isSearchable
                          options={teacherOptions}
                          value={selectedTeacher}
                          onChange={(opt) =>
                            setFormData((prev) => ({
                              ...prev,
                              teacherDocumentId: opt?.value || "",
                            }))
                          }
                          placeholder="Selecciona un docente"
                          className="custom-react-select"
                        />
                      </div>
                    </div>
                  )}

                  {!teacherCtx.isCoordinator && (
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label">Docente</label>
                        <input
                          type="text"
                          className="form-control"
                          value={teacherCtx.currentTeacherLabel || ""}
                          disabled
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Día de la semana</label>
                      <Select
                        isSearchable={false}
                        options={dayOptions}
                        value={selectedDay}
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            dayOfWeek: opt?.value || 1,
                          }))
                        }
                        placeholder="Selecciona un día"
                        className="custom-react-select"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="startTime">
                        Hora de inicio
                      </label>
                      <input
                        id="startTime"
                        type="time"
                        className="form-control"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="endTime">
                        Hora de fin
                      </label>
                      <input
                        id="endTime"
                        type="time"
                        className="form-control"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label d-block">Estado</label>
                      <div className="form-check">
                        <input
                          id="isAvailable"
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.isAvailable}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="isAvailable"
                        >
                          Disponible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <button
                      type="submit"
                      className="btn btn-primary me-1"
                      disabled={submitting}
                    >
                      {submitting ? "Guardando..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger light"
                      onClick={() => navigate("/all-availability")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAvailability;
