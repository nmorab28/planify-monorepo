import { factories } from '@strapi/strapi';

import {
  relationPresent,
  buildValidationError,
  applyDefaultPopulate,
} from '../../../utils/controller-utils';

const defaultListPopulate = {
  teacher: true,
} as const;

export default factories.createCoreController('api::availability.availability', () => ({
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

    if (!data || !relationPresent(data.teacher)) {
      throw buildValidationError([
        {
          path: ['teacher'],
          message: 'teacher is required',
        },
      ]);
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;

    if (data && 'teacher' in data && !relationPresent(data.teacher)) {
      throw buildValidationError([
        {
          path: ['teacher'],
          message: 'teacher is required',
        },
      ]);
    }

    return super.update(ctx);
  },
}));
