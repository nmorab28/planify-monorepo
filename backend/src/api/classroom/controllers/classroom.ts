import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

import { buildValidationError, applyDefaultPopulate } from '../../../utils/controller-utils';

import { validateClassroomCandidate } from '../validation/classroom-validation';

const defaultListPopulate = {
  features: true,
} as const;

export default factories.createCoreController('api::classroom.classroom', ({ strapi }) => ({
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

    if (!data) {
      throw new errors.ValidationError('data is required');
    }

    const issues = validateClassroomCandidate(data);

    if (issues.length > 0) {
      throw buildValidationError(issues);
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;

    if (data) {
      const issues = validateClassroomCandidate(data, {
        partial: true,
      });

      if (issues.length > 0) {
        throw buildValidationError(issues);
      }
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const documentId = ctx.params?.id as string | undefined;

    if (typeof documentId === 'string' && documentId.trim().length > 0) {
      const linkedSessions = await strapi.documents('api::class-session.class-session').findMany({
        filters: { classroom: { documentId } },
        fields: ['documentId'],
        limit: 1,
        status: 'published',
      });

      if (Array.isArray(linkedSessions) && linkedSessions.length > 0) {
        throw new errors.ApplicationError(
          'No se puede eliminar el aula porque tiene sesiones de clase asignadas. Reasigna o elimina primero las sesiones.',
          { code: 'CLASSROOM_HAS_SESSIONS' }
        );
      }
    }

    return super.delete(ctx);
  },
}));
