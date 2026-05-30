const coordinator = ['academic_coordinator'];
const teacher = ['teacher'];
const student = ['student'];
const allRoles = [...coordinator, ...teacher, ...student];

export const MenuList = [
  {
    title: 'Planify',
    classsChange: 'menu-title',
    extraclass: 'first',
    roles: allRoles,
  },
  {
    title: 'Inicio',
    classsChange: 'mm-collapse',
    iconStyle: <i className="la la-home" />,
    roles: allRoles,
    content: [{ title: 'Panel principal', to: 'dashboard', roles: allRoles }],
  },
  {
    title: 'Planificación',
    classsChange: 'mm-collapse',
    iconStyle: <i className="la la-cogs" />,
    roles: coordinator,
    content: [
      { title: 'Parámetros del semestre', to: 'schedule-config' },
      { title: 'Reglas de horario', to: 'rules' },
    ],
  },
  {
    title: 'Docentes',
    classsChange: 'mm-collapse',
    iconStyle: <i className="la la-user" />,
    roles: coordinator,
    content: [
      { title: 'Todos los docentes', to: 'all-professors' },
      { title: 'Crear docente', to: 'add-professor' },
      { title: 'Importar docentes', to: 'import-professors' },
    ],
  },
  {
    title: 'Cursos',
    classsChange: 'mm-collapse',
    iconStyle: <i className="la la-graduation-cap" />,
    roles: coordinator,
    content: [
      { title: 'Todos los cursos', to: 'all-courses' },
      { title: 'Crear curso', to: 'add-courses' },
    ],
  },
  {
    title: 'Aulas',
    classsChange: 'mm-collapse',
    iconStyle: <i className="la la-building" />,
    roles: coordinator,
    content: [
      { title: 'Todas las aulas', to: 'all-classrooms' },
      { title: 'Crear aula', to: 'add-classroom' },
    ],
  },
  {
    title: 'Disponibilidad',
    classsChange: 'mm-collapse',
    iconStyle: <i className="la la-calendar" />,
    roles: [...coordinator, ...teacher],
    content: [
      { title: 'Disponibilidades', to: 'all-availability', roles: [...coordinator, ...teacher] },
      { title: 'Crear disponibilidad', to: 'add-availability', roles: [...coordinator, ...teacher] },
    ],
  },
  {
    title: 'Sesiones de clase',
    classsChange: 'mm-collapse',
    iconStyle: <i className="la la-book" />,
    roles: coordinator,
    content: [
      { title: 'Calendario semanal', to: 'schedule-calendar' },
      { title: 'Todas las sesiones', to: 'all-class-sessions' },
      { title: 'Crear sesión', to: 'add-class-session' },
    ],
  },
];

export const getMenuListByRole = (role = 'academic_coordinator') => {
  const normalizedRole = role || 'academic_coordinator';
  const canSee = (item) => !item.roles || item.roles.includes(normalizedRole);

  return MenuList.filter(canSee)
    .map((item) => ({
      ...item,
      content: item.content?.filter(canSee),
    }))
    .filter((item) => item.classsChange === 'menu-title' || !item.content || item.content.length > 0);
};
