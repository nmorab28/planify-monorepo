/**
 * Funciones puras de validación de aulas (classroom).
 * Sin dependencias de Strapi para facilitar pruebas unitarias con Vitest.
 */

export type ClassroomCandidate = {
  code?: unknown;
  name?: unknown;
  capacity?: unknown;
  isActive?: unknown;
};

export type ValidationIssue = {
  path: string[];
  message: string;
};

export type ValidationOptions = {
  /** Si es true, sólo valida los campos presentes (útil para PATCH/PUT parciales). */
  partial?: boolean;
};

const CODE_REGEX = /^[A-Z0-9-]{2,20}$/;
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 1000;
const MAX_NAME_LENGTH = 120;

/**
 * Devuelve un entero seguro a partir de cualquier valor o NaN si no se puede.
 * Acepta strings numéricos como "30" → 30.
 */
function toIntegerOrNaN(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return NaN;
    const parsed = parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
}

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

/**
 * Valida un candidato a aula. Devuelve la lista de problemas encontrados.
 * En modo partial, los campos ausentes no se exigen pero los presentes sí se validan.
 */
export function validateClassroomCandidate(
  input: ClassroomCandidate,
  opts: ValidationOptions = {}
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const partial = !!opts.partial;

  // ---- code -------------------------------------------------------------
  if (!isPresent(input.code)) {
    if (!partial) {
      issues.push({ path: ['code'], message: 'El código es obligatorio.' });
    }
  } else if (typeof input.code !== 'string') {
    issues.push({ path: ['code'], message: 'El código debe ser texto.' });
  } else {
    const code = input.code.trim();
    if (!CODE_REGEX.test(code)) {
      issues.push({
        path: ['code'],
        message:
          'El código debe tener entre 2 y 20 caracteres y sólo letras mayúsculas, números o guiones.',
      });
    }
  }

  // ---- name -------------------------------------------------------------
  if (!isPresent(input.name)) {
    if (!partial) {
      issues.push({ path: ['name'], message: 'El nombre es obligatorio.' });
    }
  } else if (typeof input.name !== 'string') {
    issues.push({ path: ['name'], message: 'El nombre debe ser texto.' });
  } else {
    const name = input.name.trim();
    if (name.length < 2) {
      issues.push({
        path: ['name'],
        message: 'El nombre debe tener al menos 2 caracteres.',
      });
    } else if (name.length > MAX_NAME_LENGTH) {
      issues.push({
        path: ['name'],
        message: `El nombre no puede superar ${MAX_NAME_LENGTH} caracteres.`,
      });
    }
  }

  // ---- capacity ---------------------------------------------------------
  if (!isPresent(input.capacity)) {
    if (!partial) {
      issues.push({
        path: ['capacity'],
        message: 'La capacidad es obligatoria.',
      });
    }
  } else {
    const capacity = toIntegerOrNaN(input.capacity);
    if (Number.isNaN(capacity)) {
      issues.push({
        path: ['capacity'],
        message: 'La capacidad debe ser un número entero.',
      });
    } else if (capacity < MIN_CAPACITY) {
      issues.push({
        path: ['capacity'],
        message: `La capacidad debe ser al menos ${MIN_CAPACITY}.`,
      });
    } else if (capacity > MAX_CAPACITY) {
      issues.push({
        path: ['capacity'],
        message: `La capacidad no puede superar ${MAX_CAPACITY}.`,
      });
    }
  }

  return issues;
}

/**
 * Valida un candidato a característica de aula (classroom-feature).
 * Reglas: code obligatorio (mismo formato que aula) y name obligatorio.
 */
export function validateClassroomFeatureCandidate(
  input: { code?: unknown; name?: unknown },
  opts: ValidationOptions = {}
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const partial = !!opts.partial;

  if (!isPresent(input.code)) {
    if (!partial) {
      issues.push({ path: ['code'], message: 'El código es obligatorio.' });
    }
  } else if (typeof input.code !== 'string') {
    issues.push({ path: ['code'], message: 'El código debe ser texto.' });
  } else if (!CODE_REGEX.test(input.code.trim())) {
    issues.push({
      path: ['code'],
      message:
        'El código debe tener entre 2 y 20 caracteres y sólo letras mayúsculas, números o guiones.',
    });
  }

  if (!isPresent(input.name)) {
    if (!partial) {
      issues.push({ path: ['name'], message: 'El nombre es obligatorio.' });
    }
  } else if (typeof input.name !== 'string') {
    issues.push({ path: ['name'], message: 'El nombre debe ser texto.' });
  } else if (input.name.trim().length < 2) {
    issues.push({
      path: ['name'],
      message: 'El nombre debe tener al menos 2 caracteres.',
    });
  }

  return issues;
}
