import { errors } from '@strapi/utils';

export function relationPresent(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return true;
  }

  if (typeof value === 'object' && value !== null) {
    const o = value as Record<string, unknown>;

    if (Array.isArray(o.connect)) {
      return o.connect.length > 0;
    }

    if (Array.isArray(o.set)) {
      return o.set.length > 0;
    }

    if (typeof o.documentId === 'string') {
      return o.documentId.length > 0;
    }

    if (o.id !== undefined && o.id !== null) {
      return true;
    }
  }

  return false;
}

export function buildValidationError(issues: { path: string[]; message: string }[]) {
  return new errors.ValidationError('Validation failed', {
    errors: issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
      name: 'ValidationError',
    })),
  });
}

export function applyDefaultPopulate<
  T extends {
    query: {
      populate?: unknown;
    };
  },
>(ctx: T, populate: Record<string, unknown>) {
  if (ctx.query.populate === undefined) {
    ctx.query.populate = { ...populate };
  }
}
