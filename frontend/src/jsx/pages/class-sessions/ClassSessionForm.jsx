import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { getAcademicGroups } from '../../../services/academicGroupService';
import { getClassrooms } from '../../../services/classroomService';
import {
  createClassSession,
  getClassSessionById,
  updateClassSession,
} from '../../../services/classSessionService';
import {
  DAYS_OF_WEEK,
  SESSION_STATUSES,
  formatTime,
  validateClassSession,
} from './classSessionValidation';

const initialForm = {
  dayOfWeek: 1,
  startTime: '07:00',
  endTime: '09:00',
  sessionOrder: 1,
  status: 'draft',
  isLocked: false,
  academicGroupDocumentId: '',
  classroomDocumentId: '',
};

const groupLabel = (group) => {
  const course = group.course?.name || group.course?.code || 'Curso sin nombre';
  const teacher = group.teacher
    ? `${group.teacher.firstName || ''} ${group.teacher.lastName || ''}`.trim()
    : 'Docente sin asignar';
  return `${group.code} - ${course} - ${teacher}`;
};

const classroomLabel = (classroom) => `${classroom.code} - ${classroom.name} (${classroom.capacity})`;

const ClassSessionForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState(initialForm);
  const [groups, setGroups] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [groupsRes, classroomsRes] = await Promise.all([getAcademicGroups(), getClassrooms()]);
        setGroups(groupsRes || []);
        setClassrooms((classroomsRes || []).filter((classroom) => classroom.isActive !== false));
      } catch (err) {
        Swal.fire('Error', err.message || 'No se pudieron cargar los catálogos', 'error');
      }
    };

    loadCatalogs();
  }, []);

  useEffect(() => {
    if (!isEdit || !documentId) return;

    const loadSession = async () => {
      try {
        setLoading(true);
        const session = await getClassSessionById(documentId);
        setFormData({
          dayOfWeek: session.dayOfWeek || 1,
          startTime: formatTime(session.startTime) || '07:00',
          endTime: formatTime(session.endTime) || '09:00',
          sessionOrder: session.sessionOrder || 1,
          status: session.status || 'draft',
          isLocked: !!session.isLocked,
          academicGroupDocumentId: session.academicGroup?.documentId || '',
          classroomDocumentId: session.classroom?.documentId || '',
        });
      } catch (err) {
        Swal.fire('Error', err.message || 'No se pudo cargar la sesión', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [documentId, isEdit]);

  const groupOptions = useMemo(
    () => groups.map((group) => ({ value: group.documentId, label: groupLabel(group) })),
    [groups]
  );

  const classroomOptions = useMemo(
    () => classrooms.map((classroom) => ({ value: classroom.documentId, label: classroomLabel(classroom) })),
    [classrooms]
  );

  const selectedGroup = groupOptions.find((option) => option.value === formData.academicGroupDocumentId) || null;
  const selectedClassroom =
    classroomOptions.find((option) => option.value === formData.classroomDocumentId) || null;

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const errors = validateClassSession(formData);
    if (errors.length > 0) {
      Swal.fire('Datos inválidos', errors[0], 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (isEdit) {
        await updateClassSession(documentId, formData);
      } else {
        await createClassSession(formData);
      }

      await Swal.fire({
        icon: 'success',
        title: isEdit ? 'Sesión actualizada' : 'Sesión creada',
        timer: 1300,
        showConfirmButton: false,
      });
      navigate('/all-class-sessions');
    } catch (err) {
      Swal.fire('No se pudo guardar', err.message || 'Verifica las reglas del horario', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageTitle activeMenu="Cargando sesión" motherMenu="Sesiones" />
        <p>Cargando información...</p>
      </>
    );
  }

  return (
    <>
      <PageTitle
        activeMenu={isEdit ? 'Editar sesión' : 'Crear sesión'}
        motherMenu="Sesiones de clase"
      />
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">{isEdit ? 'Editar sesión' : 'Nueva sesión'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="form-label">Grupo académico</label>
                      <Select
                        options={groupOptions}
                        value={selectedGroup}
                        onChange={(option) =>
                          setFormData((prev) => ({
                            ...prev,
                            academicGroupDocumentId: option?.value || '',
                          }))
                        }
                        placeholder="Selecciona curso, grupo y docente"
                        noOptionsMessage={() => 'No hay grupos académicos disponibles'}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dayOfWeek">
                        Día
                      </label>
                      <select
                        id="dayOfWeek"
                        className="form-control"
                        value={formData.dayOfWeek}
                        onChange={handleChange}
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="startTime">
                        Hora inicio
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

                  <div className="col-sm-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="endTime">
                        Hora fin
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
                      <label className="form-label">Aula</label>
                      <Select
                        options={classroomOptions}
                        value={selectedClassroom}
                        onChange={(option) =>
                          setFormData((prev) => ({
                            ...prev,
                            classroomDocumentId: option?.value || '',
                          }))
                        }
                        placeholder="Selecciona un aula"
                        noOptionsMessage={() => 'No hay aulas activas disponibles'}
                      />
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="sessionOrder">
                        Orden
                      </label>
                      <input
                        id="sessionOrder"
                        type="number"
                        min="1"
                        className="form-control"
                        value={formData.sessionOrder}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="status">
                        Estado
                      </label>
                      <select
                        id="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        {SESSION_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group form-check">
                      <input
                        id="isLocked"
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.isLocked}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="isLocked">
                        Bloquear esta sesión para evitar cambios accidentales
                      </label>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <button type="submit" className="btn btn-primary me-2" disabled={submitting}>
                      {submitting ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger light"
                      onClick={() => navigate('/all-class-sessions')}
                    >
                      Cancelar
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

export default ClassSessionForm;
