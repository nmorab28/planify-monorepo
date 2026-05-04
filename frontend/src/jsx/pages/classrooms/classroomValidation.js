export const CODE_REGEX = /^[A-Z0-9-]{2,20}$/;
export const MIN_CAPACITY = 1;
export const MAX_CAPACITY = 1000;
export const MAX_NAME_LENGTH = 120;

const isPresent = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

export const parseCapacity = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return NaN;
    return parseInt(trimmed, 10);
  }
  return NaN;
};

export const validateClassroom = ({ code, name, capacity }) => {
  const errors = [];

  if (!isPresent(code)) {
    errors.push('El código es obligatorio.');
  } else if (typeof code !== 'string' || !CODE_REGEX.test(code.trim())) {
    errors.push(
      'El código debe tener entre 2 y 20 caracteres y sólo letras mayúsculas, números o guiones.'
    );
  }

  if (!isPresent(name)) {
    errors.push('El nombre es obligatorio.');
  } else if (typeof name !== 'string') {
    errors.push('El nombre debe ser texto.');
  } else {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres.');
    } else if (trimmed.length > MAX_NAME_LENGTH) {
      errors.push(`El nombre no puede superar ${MAX_NAME_LENGTH} caracteres.`);
    }
  }

  if (!isPresent(capacity)) {
    errors.push('La capacidad es obligatoria.');
  } else {
    const cap = parseCapacity(capacity);
    if (Number.isNaN(cap)) {
      errors.push('La capacidad debe ser un número entero.');
    } else if (cap < MIN_CAPACITY) {
      errors.push(`La capacidad debe ser al menos ${MIN_CAPACITY}.`);
    } else if (cap > MAX_CAPACITY) {
      errors.push(`La capacidad no puede superar ${MAX_CAPACITY}.`);
    }
  }

  return errors;
};

export const validateFeature = ({ code, name }) => {
  const errors = [];

  if (!isPresent(code)) {
    errors.push('El código de la característica es obligatorio.');
  } else if (typeof code !== 'string' || !CODE_REGEX.test(code.trim())) {
    errors.push(
      'El código debe tener entre 2 y 20 caracteres y sólo letras mayúsculas, números o guiones.'
    );
  }

  if (!isPresent(name)) {
    errors.push('El nombre de la característica es obligatorio.');
  } else if (typeof name !== 'string' || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres.');
  }

  return errors;
};
