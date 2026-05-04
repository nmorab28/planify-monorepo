import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import PageTitle from '../../layouts/PageTitle';
import { getClassrooms, deleteClassroom } from '../../../services/classroomService';

const theadData = [
  { heading: 'Código', sortingVale: 'code' },
  { heading: 'Nombre', sortingVale: 'name' },
  { heading: 'Capacidad', sortingVale: 'capacity' },
  { heading: 'Características', sortingVale: 'features' },
  { heading: 'Estado', sortingVale: 'isActive' },
  { heading: 'Acciones', sortingVale: 'actions' },
];

const AllClassrooms = () => {
  const [sort, setSort] = useState(10);
  const [feeData, setFeeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [iconData, setIconDate] = useState({ complete: false, ind: Number });

  const activePag = useRef(0);
  const [test, settest] = useState(0);

  const fetchClassrooms = async () => {
    try {
      const res = await getClassrooms();

      const formatted = (res || []).map((c) => ({
        id: c.id,
        documentId: c.documentId,
        code: c.code,
        name: c.name,
        capacity: c.capacity,
        isActive: c.isActive,
        features: Array.isArray(c.features) ? c.features : [],
      }));

      setFeeData(formatted);
      setOriginalData(formatted);
    } catch (err) {
      console.error('Error fetching classrooms', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'No se pudieron cargar las aulas',
      });
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const chageData = (frist, sec) => {
    const table = document.querySelectorAll('#classroomList tbody tr');
    for (let i = 0; i < table.length; ++i) {
      if (i >= frist && i < sec) {
        table[i].classList.remove('d-none');
      } else {
        table[i].classList.add('d-none');
      }
    }
  };

  useEffect(() => {
    setData(document.querySelectorAll('#classroomList tbody tr'));
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
    const dir = iconData.complete ? 1 : -1;

    if (name === 'code') {
      sorted.sort((a, b) => dir * a.code.localeCompare(b.code));
    } else if (name === 'name') {
      sorted.sort((a, b) => dir * a.name.localeCompare(b.name));
    } else if (name === 'capacity') {
      sorted.sort((a, b) => dir * (a.capacity - b.capacity));
    } else if (name === 'isActive') {
      sorted.sort((a, b) => dir * ((a.isActive ? 1 : 0) - (b.isActive ? 1 : 0)));
    }

    setFeeData(sorted);
  };

  const DataSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = originalData.filter((item) => {
      const featuresText = item.features.map((f) => `${f.code || ''} ${f.name || ''}`).join(' ');
      return `${item.code} ${item.name} ${item.capacity} ${featuresText}`
        .toLowerCase()
        .includes(term);
    });
    setFeeData(filtered);
  };

  const handleDelete = async (documentId, code) => {
    const result = await Swal.fire({
      title: '¿Eliminar aula?',
      text: `Vas a eliminar el aula ${code}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteClassroom(documentId);
      await fetchClassrooms();
      Swal.fire('Eliminada', 'El aula fue eliminada.', 'success');
    } catch (err) {
      console.error(err);
      const isLinkedSessions = err.code === 'CLASSROOM_HAS_SESSIONS' || err.status === 400;
      Swal.fire({
        icon: 'error',
        title: isLinkedSessions ? 'No se puede eliminar' : 'Error',
        text:
          err.message || 'No se pudo eliminar el aula. Verifica que no tenga sesiones asignadas.',
      });
    }
  };

  return (
    <>
      <PageTitle activeMenu={'All Classrooms'} motherMenu={'Classrooms'} />
      <Row>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Aulas</h4>
              <Link to={'/add-classroom'} className="btn btn-primary">
                + Add New
              </Link>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <div id="classroomList" className="dataTables_wrapper no-footer">
                  <div className="justify-content-between d-sm-flex">
                    <div className="dataTables_length">
                      <label className="d-flex align-items-center">
                        Show
                        <Dropdown className="search-drop">
                          <Dropdown.Toggle as="div">{sort}</Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSort(10)}>10</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort(20)}>20</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort(30)}>30</Dropdown.Item>
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
                        {theadData.map((item, ind) => (
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
                          <td>
                            <strong>{row.code}</strong>
                          </td>
                          <td>{row.name}</td>
                          <td>{row.capacity}</td>
                          <td>
                            {row.features.length === 0 ? (
                              <span className="text-muted">—</span>
                            ) : (
                              row.features.map((f) => (
                                <span
                                  key={f.documentId || f.id}
                                  className="badge bg-info light me-1 mb-1"
                                  title={f.code}
                                >
                                  {f.name}
                                </span>
                              ))
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${row.isActive ? 'bg-success' : 'bg-secondary'}`}
                            >
                              {row.isActive ? 'Activa' : 'Inactiva'}
                            </span>
                          </td>
                          <td>
                            <Link
                              to={`/edit-classroom/${row.documentId}`}
                              className="btn btn-xs sharp btn-primary me-1"
                            >
                              <i className="fa fa-pencil" />
                            </Link>
                            <button
                              className="btn btn-xs sharp btn-danger"
                              onClick={() => handleDelete(row.documentId, row.code)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {feeData.length === 0 && (
                        <tr>
                          <td colSpan={theadData.length} className="text-center">
                            No hay aulas registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                    <div className="dataTables_info">
                      Showing {activePag.current * sort + 1} to{' '}
                      {data.length > (activePag.current + 1) * sort
                        ? (activePag.current + 1) * sort
                        : data.length}{' '}
                      of {data.length} entries
                    </div>

                    <div
                      className="dataTables_paginate paging_simple_numbers"
                      id="example5_paginate"
                    >
                      <Link
                        className="paginate_button previous disabled"
                        to="#"
                        onClick={() => activePag.current > 0 && onClick(activePag.current - 1)}
                      >
                        Previous
                      </Link>

                      <span>
                        {paggination.map((number, i) => (
                          <Link
                            key={i}
                            to="#"
                            className={`paginate_button ${
                              activePag.current === i ? 'current' : ''
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
        </div>
      </Row>
    </>
  );
};

export default AllClassrooms;
