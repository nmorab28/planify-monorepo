export const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export const dayLabel = (dayOfWeek) => {
  const found = DAYS_OF_WEEK.find((d) => d.value === Number(dayOfWeek));
  return found ? found.label : `Día ${dayOfWeek}`;
};

export const parseTime = (value) => {
  if (typeof value !== 'string') return NaN;
  const trimmed = value.trim();
  if (!/^\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(trimmed)) return NaN;
  const [hh, mm] = trimmed.split(':');
  const hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  if (isNaN(hours) || isNaN(minutes)) return NaN;
  if (hours < 0 || hours > 23) return NaN;
  if (minutes < 0 || minutes > 59) return NaN;
  return hours * 60 + minutes;
};

export const formatTime = (value) => {
  if (typeof value !== 'string') return '';
  const [hh = '', mm = ''] = value.split(':');
  if (!hh || !mm) return '';
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;
};

export const validateRange = ({ dayOfWeek, startTime, endTime }) => {
  const errors = [];

  const day = Number(dayOfWeek);
  if (!Number.isInteger(day) || day < 1 || day > 6) {
    errors.push('El día debe ser un valor entre 1 (Lunes) y 6 (Sábado).');
  }

  if (!startTime || typeof startTime !== 'string') {
    errors.push('La hora de inicio es obligatoria.');
  }
  if (!endTime || typeof endTime !== 'string') {
    errors.push('La hora de fin es obligatoria.');
  }

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (startTime && Number.isNaN(start)) {
    errors.push('La hora de inicio tiene un formato inválido (use HH:MM).');
  }
  if (endTime && Number.isNaN(end)) {
    errors.push('La hora de fin tiene un formato inválido (use HH:MM).');
  }

  if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
    errors.push('La hora de fin debe ser mayor que la hora de inicio.');
  }

  return errors;
};

export const findOverlap = ({ dayOfWeek, startTime, endTime, excludeDocumentId }, existingList) => {
  if (!Array.isArray(existingList)) return null;

  const day = Number(dayOfWeek);
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (Number.isNaN(start) || Number.isNaN(end)) return null;

  for (const slot of existingList) {
    if (!slot) continue;
    if (excludeDocumentId && slot.documentId === excludeDocumentId) continue;
    if (Number(slot.dayOfWeek) !== day) continue;

    const slotStart = parseTime(slot.startTime);
    const slotEnd = parseTime(slot.endTime);
    if (Number.isNaN(slotStart) || Number.isNaN(slotEnd)) continue;

    if (start < slotEnd && slotStart < end) {
      return slot;
    }
  }

  return null;
};
