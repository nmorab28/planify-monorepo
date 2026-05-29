import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import PageTitle from '../../layouts/PageTitle';
import { getClassSessions } from '../../../services/classSessionService';
import { getActiveScheduleConfig, toInputTime } from '../../../services/scheduleConfigService';
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

const sessionTitle = (session) => {
  const group = session.academicGroup?.code || 'Sin grupo';
  const course =
    session.academicGroup?.course?.name || session.academicGroup?.course?.code || 'Curso';
  const classroom = session.classroom?.code || 'Sin aula';
  return `${group} - ${course} - ${classroom}`;
};

const ScheduleCalendar = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [scheduleConfig, setScheduleConfig] = useState(DEFAULT_CONFIG);
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

  const calendarEvents = useMemo(
    () =>
      sessions.map((session) => {
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
          },
        };
      }),
    [sessions]
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
                      eventClick={handleEventClick}
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
