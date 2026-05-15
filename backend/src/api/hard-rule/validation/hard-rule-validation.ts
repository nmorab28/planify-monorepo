export type HardRuleCandidate = {
  code?: unknown;
  name?: unknown;
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
const MAX_NAME_LENGTH = 120;

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateHardRuleCandidate(
  input: HardRuleCandidate,
  opts: ValidationOptions = {}
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const partial = !!opts.partial;

  if (!isPresent(input.code)) {
    if (!partial) {
      issues.push({ path: ['code'], message: 'El codigo de la regla es obligatorio.' });
    }
  } else if (typeof input.code !== 'string') {
    issues.push({ path: ['code'], message: 'El codigo de la regla debe ser texto.' });
  } else if (!CODE_REGEX.test(input.code.trim())) {
    issues.push({
      path: ['code'],
      message:
        'El codigo debe tener entre 2 y 80 caracteres y solo usar mayusculas, numeros, guion o guion bajo.',
    });
  }

  if (!isPresent(input.name)) {
    if (!partial) {
      issues.push({ path: ['name'], message: 'El nombre de la regla es obligatorio.' });
    }
  } else if (typeof input.name !== 'string') {
    issues.push({ path: ['name'], message: 'El nombre de la regla debe ser texto.' });
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

  if (input.isEnabled !== undefined && typeof input.isEnabled !== 'boolean') {
    issues.push({ path: ['isEnabled'], message: 'isEnabled debe ser booleano.' });
  }

  if (input.parameters !== undefined && input.parameters !== null && !isPlainObject(input.parameters)) {
    issues.push({ path: ['parameters'], message: 'parameters debe ser un objeto JSON.' });
  }

  return issues;
}
