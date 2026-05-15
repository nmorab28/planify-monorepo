import { relationPresent } from '../../../utils/controller-utils';
import { timeToMinutes } from './session-validation';

export type ClassSessionCandidate = {
  dayOfWeek?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  sessionOrder?: unknown;
  status?: unknown;
  isLocked?: unknown;
  academicGroup?: unknown;
  classroom?: unknown;
};

export type ValidationIssue = {
  path: string[];
  message: string;
};

export type ValidationOptions = {
  partial?: boolean;
};

const VALID_STATUSES = new Set(['draft', 'planned', 'published', 'blocked', 'cancelled']);

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

function toIntegerOrNaN(value: unknown): number {
  if (typeof value === 'number') return Number.isInteger(value) ? value : NaN;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return NaN;
    return Number.parseInt(trimmed, 10);
  }

  return NaN;
}

function validateRequiredRelation(
  issues: ValidationIssue[],
  field: 'academicGroup' | 'classroom',
  value: unknown,
  partial: boolean
) {
  if (value === undefined && partial) return;

  if (!relationPresent(value)) {
    issues.push({ path: [field], message: `${field} es obligatorio.` });
  }
}

export function validateClassSessionCandidate(
  input: ClassSessionCandidate,
  opts: ValidationOptions = {}
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const partial = !!opts.partial;

  if (!isPresent(input.dayOfWeek)) {
    if (!partial) issues.push({ path: ['dayOfWeek'], message: 'El dia de la semana es obligatorio.' });
  } else {
    const dayOfWeek = toIntegerOrNaN(input.dayOfWeek);

    if (Number.isNaN(dayOfWeek) || dayOfWeek < 1 || dayOfWeek > 6) {
      issues.push({ path: ['dayOfWeek'], message: 'El dia de la semana debe estar entre 1 y 6.' });
    }
  }

  const startMinutes = isPresent(input.startTime) ? timeToMinutes(String(input.startTime)) : NaN;
  const endMinutes = isPresent(input.endTime) ? timeToMinutes(String(input.endTime)) : NaN;

  if (!isPresent(input.startTime)) {
    if (!partial) issues.push({ path: ['startTime'], message: 'La hora de inicio es obligatoria.' });
  } else if (Number.isNaN(startMinutes)) {
    issues.push({ path: ['startTime'], message: 'La hora de inicio debe tener formato HH:MM.' });
  }

  if (!isPresent(input.endTime)) {
    if (!partial) issues.push({ path: ['endTime'], message: 'La hora de fin es obligatoria.' });
  } else if (Number.isNaN(endMinutes)) {
    issues.push({ path: ['endTime'], message: 'La hora de fin debe tener formato HH:MM.' });
  }

  if (!Number.isNaN(startMinutes) && !Number.isNaN(endMinutes) && startMinutes >= endMinutes) {
    issues.push({ path: ['endTime'], message: 'La hora de fin debe ser posterior a la hora de inicio.' });
  }

  if (input.sessionOrder !== undefined) {
    const sessionOrder = toIntegerOrNaN(input.sessionOrder);

    if (Number.isNaN(sessionOrder) || sessionOrder < 1) {
      issues.push({ path: ['sessionOrder'], message: 'El orden de sesion debe ser un entero mayor o igual a 1.' });
    }
  }

  if (input.status !== undefined && (typeof input.status !== 'string' || !VALID_STATUSES.has(input.status))) {
    issues.push({ path: ['status'], message: 'El estado de la sesion no es valido.' });
  }

  if (input.isLocked !== undefined && typeof input.isLocked !== 'boolean') {
    issues.push({ path: ['isLocked'], message: 'isLocked debe ser booleano.' });
  }

  validateRequiredRelation(issues, 'academicGroup', input.academicGroup, partial);
  validateRequiredRelation(issues, 'classroom', input.classroom, partial);

  return issues;
}
