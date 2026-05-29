import { dayLabel, formatTime, statusLabel } from './classSessionValidation';

const getCourseName = (session) =>
  session.academicGroup?.course?.name ||
  session.academicGroup?.course?.code ||
  'Curso sin asignar';

const getTeacherName = (session) => {
  const teacher = session.academicGroup?.teacher;
  if (!teacher) return 'Docente sin asignar';
  return `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.email;
};

const getClassroomName = (session) =>
  session.classroom ? `${session.classroom.code} - ${session.classroom.name}` : 'Sin aula';

const escapeCsvValue = (value) => {
  const text = String(value ?? '');
  if (!/[",\n;]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
};

const toCsv = (headers, rows) => {
  const lines = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => row.map(escapeCsvValue).join(',')),
  ];
  return `\uFEFF${lines.join('\n')}`;
};

export const buildClassSessionsCsv = (sessions) => {
  const headers = [
    'Día',
    'Hora inicio',
    'Hora fin',
    'Grupo',
    'Curso',
    'Docente',
    'Aula',
    'Estado',
    'Bloqueada',
  ];

  const rows = (sessions || []).map((session) => [
    dayLabel(session.dayOfWeek),
    formatTime(session.startTime),
    formatTime(session.endTime),
    session.academicGroup?.code || 'Sin grupo',
    getCourseName(session),
    getTeacherName(session),
    getClassroomName(session),
    statusLabel(session.status),
    session.isLocked ? 'Sí' : 'No',
  ]);

  return toCsv(headers, rows);
};

export const downloadCsv = (filename, csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportClassSessionsCsv = (sessions, filename = 'horarios-planify.csv') => {
  downloadCsv(filename, buildClassSessionsCsv(sessions));
};
