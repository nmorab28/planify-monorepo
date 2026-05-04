import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const defaultListPopulate = {
  teacher: true,
} as const;

function relationPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return true;
  if (typeof value === 'object' && value !== null) {
    const o = value as Record<string, unknown>;
    if (Array.isArray(o.connect)) return o.connect.length > 0;
    if (Array.isArray(o.set)) return o.set.length > 0;
    if (typeof o.documentId === 'string' && o.documentId.length > 0) return true;
    if (o.id !== undefined && o.id !== null) return true;
    return false;
  }
  return false;
}

export default factories.createCoreController('api::availability.availability', () => ({
  async find(ctx) {
    if (ctx.query.populate === undefined) {
      ctx.query.populate = { ...defaultListPopulate };
    }
    return super.find(ctx);
  },
  async findOne(ctx) {
    if (ctx.query.populate === undefined) {
      ctx.query.populate = { ...defaultListPopulate };
    }
    return super.findOne(ctx);
  },
  async create(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;
    if (!data || !relationPresent(data.teacher)) {
      throw new errors.ValidationError('Validation failed', {
        errors: [
          {
            path: ['teacher'],
            message: 'teacher is required',
            name: 'ValidationError',
          },
        ],
      });
    }
    return super.create(ctx);
  },
  async update(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;
    if (data && 'teacher' in data && !relationPresent(data.teacher)) {
      throw new errors.ValidationError('Validation failed', {
        errors: [
          {
            path: ['teacher'],
            message: 'teacher is required',
            name: 'ValidationError',
          },
        ],
      });
    }
    return super.update(ctx);
  },
}));
