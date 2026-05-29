import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import PageTitle from '../../layouts/PageTitle';
import { getClassSessions, patchClassSession, publishClassSessions } from '../../../services/classSessionService';
import { getActiveScheduleConfig, toInputTime } from '../../../services/scheduleConfigService';
import { exportClassSessionsCsv } from '../class-sessions/classSessionExport';
import { dayLabel, formatTime, statusLabel } from '../class-sessions/classSessionValidation';

const BASE_WEEK_START = '2026-01-05';

const statusClassName = {
  draft: 'bg-secondary',
  planned: 'bg-primary',
  published: 'bg-success',
  blocked: 'bg-warning',
  cancelled: 'bg-danger',
};

const DEFAULT_CONFIG = {
  weekdayStart: '07:00',
  weekdayEnd: '22:00',
  saturdayStart: '07:00',
  saturdayEnd: '13:00',
  lunchStart: '12:00',
  lunchEnd: '13:00',
};

const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const toCalendarTime = (date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const toDayOfWeek = (date) => {
  const day = date.getDay();
  return day === 0 ? 7 : day;
};

const sessionTitle = (session) => {
  const group = session.academicGroup?.code || 'Sin grupo';
  const course =
    session.academicGroup?.course?.name || session.academicGroup?.course?.code || 'Curso';
  const classroom = session.classroom?.code || 'Sin aula';
  return `${group} - ${course} - ${classroom}`;
};

const teacherName = (session) => {
  const teacher = session.academicGroup?.teacher;
  if (!teacher) return 'Sin docente';
  return `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.email;
};

const uniqueOptions = (sessions, getOption) => {
  const map = new Map();
  sessions.forEach((session) => {
    const option = getOption(session);
    if (option?.value && !map.has(option.value)) {
      map.set(option.value, option);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
};

const ScheduleCalendar = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [scheduleConfig, setScheduleConfig] = useState(DEFAULT_CONFIG);
  const [filters, setFilters] = useState({
    teacherDocumentId: '',
    classroomDocumentId: '',
    academicGroupDocumentId: '',
  });
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const [res, activeConfig] = await Promise.all([
        getClassSessions(),
        getActiveScheduleConfig().catch(() => null),
      ]);
      setSessions(res || []);
      if (activeConfig) {
        setScheduleConfig({
          weekdayStart: toInputTime(activeConfig.weekdayStart) || DEFAULT_CONFIG.weekdayStart,
          weekdayEnd: toInputTime(activeConfig.weekdayEnd) || DEFAULT_CONFIG.weekdayEnd,
          saturdayStart: toInputTime(activeConfig.saturdayStart) || DEFAULT_CONFIG.saturdayStart,
          saturdayEnd: toInputTime(activeConfig.saturdayEnd) || DEFAULT_CONFIG.saturdayEnd,
          lunchStart: toInputTime(activeConfig.lunchStart) || DEFAULT_CONFIG.lunchStart,
          lunchEnd: toInputTime(activeConfig.lunchEnd) || DEFAULT_CONFIG.lunchEnd,
        });
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudieron cargar las sesiones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filterOptions = useMemo(
    () => ({
      teachers: uniqueOptions(sessions, (session) => ({
        value: session.academicGroup?.teacher?.documentId,
        label: teacherName(session),
      })),
      classrooms: uniqueOptions(sessions, (session) => ({
        value: session.classroom?.documentId,
        label: session.classroom
          ? `${session.classroom.code} - ${session.classroom.name}`
          : 'Sin aula',
      })),
      groups: uniqueOptions(sessions, (session) => ({
        value: session.academicGroup?.documentId,
        label: session.academicGroup?.code || 'Sin grupo',
      })),
    }),
    [sessions]
  );

  const visibleSessions = useMemo(
    () =>
      sessions.filter((session) => {
        if (
          filters.teacherDocumentId &&
          session.academicGroup?.teacher?.documentId !== filters.teacherDocumentId
        ) {
          return false;
        }

        if (
          filters.classroomDocumentId &&
          session.classroom?.documentId !== filters.classroomDocumentId
        ) {
          return false;
        }

        if (
          filters.academicGroupDocumentId &&
          session.academicGroup?.documentId !== filters.academicGroupDocumentId
        ) {
          return false;
        }

        return true;
      }),
    [filters, sessions]
  );

  const calendarEvents = useMemo(
    () =>
      visibleSessions.map((session) => {
        const date = addDays(BASE_WEEK_START, Number(session.dayOfWeek || 1) - 1);
        return {
          id: session.documentId,
          title: sessionTitle(session),
          start: `${date}T${formatTime(session.startTime)}:00`,
          end: `${date}T${formatTime(session.endTime)}:00`,
          className: statusClassName[session.status] || 'bg-primary',
          extendedProps: {
            status: statusLabel(session.status),
            day: dayLabel(session.dayOfWeek),
            locked: session.isLocked,
            session,
          },
        };
      }),
    [visibleSessions]
  );

  const lunchEvents = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6].map((day) => {
        const date = addDays(BASE_WEEK_START, day - 1);
        return {
          id: `lunch-${day}`,
          start: `${date}T${scheduleConfig.lunchStart}:00`,
          end: `${date}T${scheduleConfig.lunchEnd}:00`,
          display: 'background',
          color: '#fff3cd',
        };
      }),
    [scheduleConfig.lunchEnd, scheduleConfig.lunchStart]
  );

  const businessHours = useMemo(
    () => [
      {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: scheduleConfig.weekdayStart,
        endTime: scheduleConfig.weekdayEnd,
      },
      {
        daysOfWeek: [6],
        startTime: scheduleConfig.saturdayStart,
        endTime: scheduleConfig.saturdayEnd,
      },
    ],
    [
      scheduleConfig.saturdayEnd,
      scheduleConfig.saturdayStart,
      scheduleConfig.weekdayEnd,
      scheduleConfig.weekdayStart,
    ]
  );

  const eventContent = (eventInfo) => (
    <div>
      <strong>{eventInfo.timeText}</strong>
      <div>{eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.locked && <small>Bloqueada</small>}
    </div>
  );

  const handleEventClick = (info) => {
    navigate(`/edit-class-session/${info.event.id}`);
  };

  const handleEventDrop = async (info) => {
    const session = info.event.extendedProps?.session;

    if (!session?.documentId || !info.event.start || !info.event.end) {
      info.revert();
      return;
    }

    if (session.isLocked) {
      info.revert();
      Swal.fire('Sesión bloqueada', 'Desbloquea la sesión antes de reprogramarla.', 'info');
      return;
    }

    const dayOfWeek = toDayOfWeek(info.event.start);

    if (dayOfWeek < 1 || dayOfWeek > 6) {
      info.revert();
      Swal.fire('Día inválido', 'Solo se permiten clases de lunes a sábado.', 'error');
      return;
    }

    try {
      await patchClassSession(session.documentId, {
        dayOfWeek,
        startTime: toCalendarTime(info.event.start),
        endTime: toCalendarTime(info.event.end),
      });
      await loadSessions();
      Swal.fire({
        icon: 'success',
        title: 'Sesión reprogramada',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      info.revert();
      Swal.fire('No se pudo reprogramar', err.message || 'Verifica las reglas del horario.', 'error');
    }
  };

  const handleFilterChange = (event) => {
    const { id, value } = event.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const clearFilters = () => {
    setFilters({
      teacherDocumentId: '',
      classroomDocumentId: '',
      academicGroupDocumentId: '',
    });
  };

  const publishVisibleSchedule = async () => {
    const publishableCount = visibleSessions.filter(
      (session) => !session.isLocked && ['draft', 'planned'].includes(session.status)
    ).length;

    if (publishableCount === 0) {
      Swal.fire('Sin sesiones pendientes', 'No hay sesiones visibles para publicar.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Publicar sesiones visibles',
      text: `Se publicaran ${publishableCount} sesiones del filtro actual.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Publicar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const summary = await publishClassSessions(visibleSessions);
      await loadSessions();
      Swal.fire(
        'Horario publicado',
        `${summary.published} sesiones publicadas. ${summary.failed} fallaron.`,
        summary.failed > 0 ? 'warning' : 'success'
      );
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo publicar el horario', 'error');
    }
  };

  const exportVisibleSchedule = () => {
    exportClassSessionsCsv(visibleSessions, 'calendario-planify.csv');
  };

  return (
    <>
      <PageTitle activeMenu="Calendario semanal" motherMenu="Horarios" />
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Vista calendario base</h4>
              <div>
                <Link to="/all-class-sessions" className="btn btn-outline-primary me-2">
                  Ver sesiones
                </Link>
                <button type="button" className="btn btn-outline-secondary me-2" onClick={exportVisibleSchedule}>
                  Exportar CSV
                </button>
                <button type="button" className="btn btn-outline-success me-2" onClick={publishVisibleSchedule}>
                  Publicar visibles
                </button>
                <Link to="/add-class-session" className="btn btn-primary">
                  + Nueva sesion
                </Link>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando calendario...</p>
              ) : (
                <>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="teacherDocumentId">
                        Docente
                      </label>
                      <select
                        id="teacherDocumentId"
                        className="form-control"
                        value={filters.teacherDocumentId}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos los docentes</option>
                        {filterOptions.teachers.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="classroomDocumentId">
                        Aula
                      </label>
                      <select
                        id="classroomDocumentId"
                        className="form-control"
                        value={filters.classroomDocumentId}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todas las aulas</option>
                        {filterOptions.classrooms.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="academicGroupDocumentId">
                        Grupo
                      </label>
                      <select
                        id="academicGroupDocumentId"
                        className="form-control"
                        value={filters.academicGroupDocumentId}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos los grupos</option>
                        {filterOptions.groups.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
                    <span>
                      Mostrando <strong>{visibleSessions.length}</strong> de{' '}
                      <strong>{sessions.length}</strong> sesiones
                    </span>
                    <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>
                      Limpiar filtros
                    </button>
                  </div>
                  <div className="mb-3 d-flex flex-wrap gap-2">
                    <span className="badge bg-secondary">Borrador</span>
                    <span className="badge bg-primary">Planeada</span>
                    <span className="badge bg-success">Publicada</span>
                    <span className="badge bg-warning">Bloqueada</span>
                    <span className="badge bg-danger">Cancelada</span>
                    <span className="badge bg-light text-dark">Almuerzo</span>
                  </div>
                  <div className="mb-3 text-muted">
                    Lunes a viernes {scheduleConfig.weekdayStart} - {scheduleConfig.weekdayEnd}.
                    Sabado {scheduleConfig.saturdayStart} - {scheduleConfig.saturdayEnd}.
                    Almuerzo {scheduleConfig.lunchStart} - {scheduleConfig.lunchEnd}.
                  </div>
                  <div className="demo-app-calendar" id="scheduleCalendar">
                    <FullCalendar
                      plugins={[timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      initialDate={BASE_WEEK_START}
                      headerToolbar={{
                        start: '',
                        center: '',
                        end: '',
                      }}
                      dayHeaderFormat={{ weekday: 'long' }}
                      allDaySlot={false}
                      slotMinTime={`${scheduleConfig.weekdayStart}:00`}
                      slotMaxTime={`${scheduleConfig.weekdayEnd}:00`}
                      slotDuration="00:30:00"
                      hiddenDays={[0]}
                      firstDay={1}
                      locale="es"
                      height="auto"
                      nowIndicator={false}
                      businessHours={businessHours}
                      events={[...lunchEvents, ...calendarEvents]}
                      editable
                      eventDurationEditable={false}
                      eventStartEditable
                      eventClick={handleEventClick}
                      eventDrop={handleEventDrop}
                      eventContent={eventContent}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleCalendar;
