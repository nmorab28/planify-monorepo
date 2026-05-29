import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import PageTitle from '../../layouts/PageTitle';
import {
  deleteClassSession,
  getClassSessions,
  patchClassSession,
} from '../../../services/classSessionService';
import { dayLabel, formatTime, statusLabel } from './classSessionValidation';

const sortSessions = (sessions) =>
  [...sessions].sort((a, b) => {
    if (Number(a.dayOfWeek) !== Number(b.dayOfWeek)) {
      return Number(a.dayOfWeek) - Number(b.dayOfWeek);
    }
    return formatTime(a.startTime).localeCompare(formatTime(b.startTime));
  });

const getCourseName = (session) =>
  session.academicGroup?.course?.name ||
  session.academicGroup?.course?.code ||
  'Curso sin asignar';

const getTeacherName = (session) => {
  const teacher = session.academicGroup?.teacher;
  if (!teacher) return 'Docente sin asignar';
  return `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.email;
};

const AllClassSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await getClassSessions();
      setSessions(sortSessions(res || []));
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudieron cargar las sesiones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sessions;

    return sessions.filter((session) => {
      const text = [
        session.academicGroup?.code,
        getCourseName(session),
        getTeacherName(session),
        session.classroom?.code,
        session.classroom?.name,
        dayLabel(session.dayOfWeek),
        statusLabel(session.status),
      ]
        .join(' ')
        .toLowerCase();

      return text.includes(term);
    });
  }, [search, sessions]);

  const handleDelete = async (session) => {
    if (session.isLocked) {
      Swal.fire('Sesion bloqueada', 'Desbloquea la sesion antes de eliminarla.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Eliminar sesion',
      text: `Se eliminara la sesion de ${getCourseName(session)} del ${dayLabel(session.dayOfWeek)}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteClassSession(session.documentId);
      await loadSessions();
      Swal.fire('Eliminada', 'La sesion fue eliminada.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo eliminar la sesion', 'error');
    }
  };

  const toggleLock = async (session) => {
    try {
      await patchClassSession(session.documentId, { isLocked: !session.isLocked });
      await loadSessions();
      Swal.fire({
        icon: 'success',
        title: session.isLocked ? 'Sesion desbloqueada' : 'Sesion bloqueada',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo cambiar el bloqueo', 'error');
    }
  };

  return (
    <>
      <PageTitle activeMenu="Sesiones de clase" motherMenu="Horarios" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Sesiones de clase</h4>
              <Link to="/add-class-session" className="btn btn-primary">
                + Nueva sesion
              </Link>
            </div>
            <div className="card-body">
              <div className="d-sm-flex justify-content-between mb-3">
                <div>
                  <strong>{filteredSessions.length}</strong> sesiones registradas
                </div>
                <div className="dataTables_filter">
                  <label>
                    Buscar:
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </label>
                </div>
              </div>

              {loading ? (
                <p>Cargando sesiones...</p>
              ) : (
                <div className="table-responsive">
                  <table className="display dataTable no-footer w-100">
                    <thead>
                      <tr>
                        <th>Dia</th>
                        <th>Horario</th>
                        <th>Grupo</th>
                        <th>Curso</th>
                        <th>Docente</th>
                        <th>Aula</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((session) => (
                        <tr key={session.documentId}>
                          <td>{dayLabel(session.dayOfWeek)}</td>
                          <td>
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </td>
                          <td>{session.academicGroup?.code || 'Sin grupo'}</td>
                          <td>{getCourseName(session)}</td>
                          <td>{getTeacherName(session)}</td>
                          <td>
                            {session.classroom
                              ? `${session.classroom.code} - ${session.classroom.name}`
                              : 'Sin aula'}
                          </td>
                          <td>
                            <span className="badge bg-primary light me-1">
                              {statusLabel(session.status)}
                            </span>
                            {session.isLocked && (
                              <span className="badge bg-warning light">Bloqueada</span>
                            )}
                          </td>
                          <td>
                            <Link
                              to={`/edit-class-session/${session.documentId}`}
                              className="btn btn-xs sharp btn-primary me-1"
                              title="Editar"
                            >
                              <i className="fa fa-pencil" />
                            </Link>
                            <button
                              type="button"
                              className="btn btn-xs sharp btn-warning me-1"
                              title={session.isLocked ? 'Desbloquear' : 'Bloquear'}
                              onClick={() => toggleLock(session)}
                            >
                              <i className={session.isLocked ? 'fa fa-unlock' : 'fa fa-lock'} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs sharp btn-danger"
                              title="Eliminar"
                              onClick={() => handleDelete(session)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredSessions.length === 0 && (
                    <p className="text-center text-muted mt-3">No hay sesiones para mostrar.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllClassSessions;
