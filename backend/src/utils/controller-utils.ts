import { errors } from '@strapi/utils';
import type { Core } from '@strapi/strapi';

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

export function requireDataPayload(ctx: {
  request: { body?: { data?: Record<string, unknown> } };
}): Record<string, unknown> {
  const data = ctx.request.body?.data;

  if (!data) {
    throw new errors.ValidationError('data is required');
  }

  return data;
}

export function uppercaseField(data: Record<string, unknown>, field: string): string | null {
  const value = data[field];

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  if (normalized.length === 0) {
    return null;
  }

  data[field] = normalized;
  return normalized;
}

export async function ensureUniqueDocumentField(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  field: string,
  value: string,
  currentDocumentId: string | undefined,
  message: string,
  code: string
): Promise<void> {
  const existing = await strapi.documents(uid).findMany({
    filters: { [field]: { $eq: value } },
    fields: ['documentId', field],
    limit: 1,
  } as never);

  const duplicated = Array.isArray(existing)
    ? existing.find((item) => item.documentId !== currentDocumentId)
    : null;

  if (duplicated) {
    throw new errors.ValidationError(message, { code });
  }
}
