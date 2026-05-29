import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const roleLabels = {
  academic_coordinator: 'Coordinador académico',
  teacher: 'Docente',
  student: 'Estudiante',
};

const coordinatorActions = [
  {
    title: 'Calendario semanal',
    description: 'Revisar sesiones por día, hora, docente, aula y grupo.',
    icon: 'la la-calendar-check',
    to: '/schedule-calendar',
  },
  {
    title: 'Crear sesión',
    description: 'Programar una clase con validaciones de horario y aula.',
    icon: 'la la-plus-circle',
    to: '/add-class-session',
  },
  {
    title: 'Reglas de horario',
    description: 'Ajustar reglas obligatorias y blandas del periodo académico.',
    icon: 'la la-cogs',
    to: '/rules',
  },
  {
    title: 'Cursos y aulas',
    description: 'Gestionar catálogos base para la generación de horarios.',
    icon: 'la la-building',
    to: '/all-courses',
  },
];

const teacherActions = [
  {
    title: 'Mi disponibilidad',
    description: 'Consultar y registrar rangos disponibles para clase.',
    icon: 'la la-clock',
    to: '/all-availability',
  },
];

const studentActions = [
  {
    title: 'Panel principal',
    description: 'Consultar la información disponible para el periodo académico.',
    icon: 'la la-home',
    to: '/dashboard',
  },
];

const metrics = [
  { label: 'Horario institucional', value: '07:00 - 22:00', icon: 'la la-business-time' },
  { label: 'Bloque de almuerzo', value: '12:00 - 13:00', icon: 'la la-utensils' },
  { label: 'Mínimo por grupo', value: '10 estudiantes', icon: 'la la-users' },
  { label: 'Sesiones por curso', value: '1 a 4 semanales', icon: 'la la-book-open' },
];

const actionsByRole = {
  academic_coordinator: coordinatorActions,
  teacher: teacherActions,
  student: studentActions,
};

const Home = () => {
  const auth = useSelector((state) => state.auth.auth);
  const role = auth.role || 'academic_coordinator';
  const actions = actionsByRole[role] || coordinatorActions;
  const primaryAction =
    role === 'academic_coordinator'
      ? { title: 'Abrir calendario', to: '/schedule-calendar' }
      : actions[0];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Panel principal</h2>
          <p className="mb-0 text-muted">
            {roleLabels[role] || 'Usuario'} · Planify
          </p>
        </div>
        <Link to={primaryAction.to} className="btn btn-primary mt-3 mt-sm-0">
          {primaryAction.title}
        </Link>
      </div>

      <Row>
        {metrics.map((item) => (
          <Col xl={3} md={6} key={item.label}>
            <div className="card">
              <div className="card-body d-flex align-items-center">
                <span className="me-3 display-6 text-primary">
                  <i className={item.icon} />
                </span>
                <div>
                  <p className="mb-1 text-muted">{item.label}</p>
                  <h4 className="mb-0">{item.value}</h4>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row>
        {actions.map((action) => (
          <Col xl={3} md={6} key={action.title}>
            <Link to={action.to} className="text-decoration-none">
              <div className="card h-100">
                <div className="card-body">
                  <span className="display-6 text-primary">
                    <i className={action.icon} />
                  </span>
                  <h4 className="mt-3">{action.title}</h4>
                  <p className="mb-0 text-muted">{action.description}</p>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
