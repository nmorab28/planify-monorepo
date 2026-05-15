import { factories } from '@strapi/strapi';

import {
  relationPresent,
  buildValidationError,
  applyDefaultPopulate,
} from '../../../utils/controller-utils';

const defaultListPopulate = {
  course: true,
  teacher: true,
  scheduleConfig: true,
} as const;

export default factories.createCoreController('api::academic-group.academic-group', () => ({
  async find(ctx) {
    applyDefaultPopulate(ctx, defaultListPopulate);
    return super.find(ctx);
  },

  async findOne(ctx) {
    applyDefaultPopulate(ctx, defaultListPopulate);
    return super.findOne(ctx);
  },

  async create(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;

    const missing: ('course' | 'teacher')[] = [];

    if (!data || !relationPresent(data.course)) {
      missing.push('course');
    }

    if (!data || !relationPresent(data.teacher)) {
      missing.push('teacher');
    }

    if (missing.length > 0) {
      throw buildValidationError(
        missing.map((field) => ({
          path: [field],
          message: `${field} is required`,
        }))
      );
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;

    if (!data) {
      return super.update(ctx);
    }

    const missing: ('course' | 'teacher')[] = [];

    if ('course' in data && !relationPresent(data.course)) {
      missing.push('course');
    }

    if ('teacher' in data && !relationPresent(data.teacher)) {
      missing.push('teacher');
    }

    if (missing.length > 0) {
      throw buildValidationError(
        missing.map((field) => ({
          path: [field],
          message: `${field} is required`,
        }))
      );
    }

    return super.update(ctx);
  },
}));
