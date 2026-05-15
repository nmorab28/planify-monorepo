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
const CODE_FORMAT_MESSAGE =
  'El codigo debe tener entre 2 y 80 caracteres y solo usar mayusculas, numeros, guion o guion bajo.';

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateRequiredString(
  issues: ValidationIssue[],
  value: unknown,
  field: keyof HardRuleCandidate,
  messages: { required: string; type: string },
  opts: ValidationOptions & { regex?: RegExp; regexMessage?: string; maxLength?: number }
) {
  if (!isPresent(value)) {
    if (!opts.partial) issues.push({ path: [field], message: messages.required });
    return;
  }

  if (typeof value !== 'string') {
    issues.push({ path: [field], message: messages.type });
    return;
  }

  const trimmed = value.trim();
  if (opts.regex && !opts.regex.test(trimmed)) {
    issues.push({ path: [field], message: opts.regexMessage ?? 'Formato invalido.' });
  } else if (trimmed.length < 2) {
    issues.push({ path: [field], message: 'El nombre debe tener al menos 2 caracteres.' });
  } else if (opts.maxLength && trimmed.length > opts.maxLength) {
    issues.push({ path: [field], message: `El nombre no puede superar ${opts.maxLength} caracteres.` });
  }
}

export function validateHardRuleCandidate(
  input: HardRuleCandidate,
  opts: ValidationOptions = {}
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  validateRequiredString(
    issues,
    input.code,
    'code',
    {
      required: 'El codigo de la regla es obligatorio.',
      type: 'El codigo de la regla debe ser texto.',
    },
    { ...opts, regex: CODE_REGEX, regexMessage: CODE_FORMAT_MESSAGE }
  );

  validateRequiredString(
    issues,
    input.name,
    'name',
    {
      required: 'El nombre de la regla es obligatorio.',
      type: 'El nombre de la regla debe ser texto.',
    },
    { ...opts, maxLength: MAX_NAME_LENGTH }
  );

  if (input.isEnabled !== undefined && typeof input.isEnabled !== 'boolean') {
    issues.push({ path: ['isEnabled'], message: 'isEnabled debe ser booleano.' });
  }

  if (input.parameters !== undefined && input.parameters !== null && !isPlainObject(input.parameters)) {
    issues.push({ path: ['parameters'], message: 'parameters debe ser un objeto JSON.' });
  }

  return issues;
}
