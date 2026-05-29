export const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miercoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sabado' },
];

export const SESSION_STATUSES = [
  { value: 'draft', label: 'Borrador' },
  { value: 'planned', label: 'Planeada' },
  { value: 'published', label: 'Publicada' },
  { value: 'blocked', label: 'Bloqueada' },
  { value: 'cancelled', label: 'Cancelada' },
];

export const dayLabel = (dayOfWeek) => {
  const found = DAYS_OF_WEEK.find((day) => day.value === Number(dayOfWeek));
  return found ? found.label : `Dia ${dayOfWeek}`;
};

export const statusLabel = (status) => {
  const found = SESSION_STATUSES.find((item) => item.value === status);
  return found ? found.label : status || 'Sin estado';
};

export const formatTime = (value) => {
  if (typeof value !== 'string') return '';
  const [hours = '', minutes = ''] = value.split(':');
  if (!hours || !minutes) return '';
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const timeToMinutes = (value) => {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return NaN;
  const [hours, minutes] = value.split(':').map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return NaN;
  return hours * 60 + minutes;
};

export const validateClassSession = (formData) => {
  const errors = [];
  const day = Number(formData.dayOfWeek);
  const start = timeToMinutes(formData.startTime);
  const end = timeToMinutes(formData.endTime);
  const order = Number(formData.sessionOrder);

  if (!Number.isInteger(day) || day < 1 || day > 6) {
    errors.push('Selecciona un dia valido entre lunes y sabado.');
  }

  if (Number.isNaN(start)) {
    errors.push('La hora de inicio debe tener formato HH:MM.');
  }

  if (Number.isNaN(end)) {
    errors.push('La hora de fin debe tener formato HH:MM.');
  }

  if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
    errors.push('La hora de fin debe ser posterior a la hora de inicio.');
  }

  if (!Number.isInteger(order) || order < 1) {
    errors.push('El orden de sesion debe ser mayor o igual a 1.');
  }

  if (!formData.academicGroupDocumentId) {
    errors.push('Selecciona un grupo academico.');
  }

  if (!formData.classroomDocumentId) {
    errors.push('Selecciona un aula.');
  }

  return errors;
};
