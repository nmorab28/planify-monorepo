const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const isPresent = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const timeToMinutes = (value) => {
  if (!TIME_RE.test(value || "")) return NaN;
  const [hh, mm] = value.split(":").map(Number);
  return hh * 60 + mm;
};

const validateTimeRange = (errors, start, end, label) => {
  if (!isPresent(start) || !isPresent(end)) {
    errors.push(`${label}: define hora de inicio y fin.`);
    return;
  }

  if (!TIME_RE.test(start) || !TIME_RE.test(end)) {
    errors.push(`${label}: usa el formato HH:mm.`);
    return;
  }

  if (timeToMinutes(start) >= timeToMinutes(end)) {
    errors.push(`${label}: la hora de inicio debe ser menor que la de fin.`);
  }
};

export const validateScheduleConfig = (formData) => {
  const errors = [];

  if (!isPresent(formData.name)) {
    errors.push("El nombre de la configuracion es obligatorio.");
  }

  if (!isPresent(formData.academicPeriod)) {
    errors.push("El periodo academico es obligatorio.");
  }

  validateTimeRange(
    errors,
    formData.weekdayStart,
    formData.weekdayEnd,
    "Jornada entre semana"
  );
  validateTimeRange(
    errors,
    formData.lunchStart,
    formData.lunchEnd,
    "Franja de almuerzo"
  );

  if (
    TIME_RE.test(formData.weekdayStart || "") &&
    TIME_RE.test(formData.weekdayEnd || "") &&
    TIME_RE.test(formData.lunchStart || "") &&
    TIME_RE.test(formData.lunchEnd || "")
  ) {
    const weekdayStart = timeToMinutes(formData.weekdayStart);
    const weekdayEnd = timeToMinutes(formData.weekdayEnd);
    const lunchStart = timeToMinutes(formData.lunchStart);
    const lunchEnd = timeToMinutes(formData.lunchEnd);

    if (lunchStart < weekdayStart || lunchEnd > weekdayEnd) {
      errors.push("La franja de almuerzo debe estar dentro de la jornada.");
    }
  }

  if (formData.saturdayEnabled) {
    validateTimeRange(
      errors,
      formData.saturdayStart,
      formData.saturdayEnd,
      "Jornada de sabado"
    );
  }

  return errors;
};
