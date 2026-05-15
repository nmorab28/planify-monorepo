export type SoftRuleCandidate = {
  code?: unknown;
  name?: unknown;
  weight?: unknown;
  isEnabled?: unknown;
  parameters?: unknown;
};

export type ValidationIssue = {
  path: string[];
  message: string;
};

export type ValidationOptions = {
  partial?: boolean;
};

const CODE_REGEX = /^[A-Z0-9_-]{2,80}$/;
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 100;
const MAX_NAME_LENGTH = 120;

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

function toIntegerOrNaN(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : NaN;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return NaN;
    return Number.parseInt(trimmed, 10);
  }

  return NaN;
}

function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateSoftRuleCandidate(
  input: SoftRuleCandidate,
  opts: ValidationOptions = {}
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const partial = !!opts.partial;

  if (!isPresent(input.code)) {
    if (!partial) {
      issues.push({ path: ['code'], message: 'El codigo es obligatorio.' });
    }
  } else if (typeof input.code !== 'string') {
    issues.push({ path: ['code'], message: 'El codigo debe ser texto.' });
  } else if (!CODE_REGEX.test(input.code.trim())) {
    issues.push({
      path: ['code'],
      message:
        'El codigo debe tener entre 2 y 80 caracteres y solo letras mayusculas, numeros, guiones o guiones bajos.',
    });
  }

  if (!isPresent(input.name)) {
    if (!partial) {
      issues.push({ path: ['name'], message: 'El nombre es obligatorio.' });
    }
  } else if (typeof input.name !== 'string') {
    issues.push({ path: ['name'], message: 'El nombre debe ser texto.' });
  } else {
    const name = input.name.trim();

    if (name.length < 2) {
      issues.push({ path: ['name'], message: 'El nombre debe tener al menos 2 caracteres.' });
    } else if (name.length > MAX_NAME_LENGTH) {
      issues.push({
        path: ['name'],
        message: `El nombre no puede superar ${MAX_NAME_LENGTH} caracteres.`,
      });
    }
  }

  if (!isPresent(input.weight)) {
    if (!partial) {
      issues.push({ path: ['weight'], message: 'El peso es obligatorio.' });
    }
  } else {
    const weight = toIntegerOrNaN(input.weight);

    if (Number.isNaN(weight)) {
      issues.push({ path: ['weight'], message: 'El peso debe ser un numero entero.' });
    } else if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
      issues.push({
        path: ['weight'],
        message: `El peso debe estar entre ${MIN_WEIGHT} y ${MAX_WEIGHT}.`,
      });
    }
  }

  if (input.isEnabled !== undefined && typeof input.isEnabled !== 'boolean') {
    issues.push({ path: ['isEnabled'], message: 'isEnabled debe ser booleano.' });
  }

  if (input.parameters !== undefined && input.parameters !== null && !isPlainObject(input.parameters)) {
    issues.push({ path: ['parameters'], message: 'parameters debe ser un objeto JSON.' });
  }

  return issues;
}
