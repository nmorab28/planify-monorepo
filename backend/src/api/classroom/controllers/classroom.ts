import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

import { validateClassroomCandidate } from '../validation/classroom-validation';

const defaultListPopulate = {
  features: true,
} as const;

function buildValidationError(issues: { path: string[]; message: string }[]) {
  return new errors.ValidationError('Validation failed', {
    errors: issues.map((i) => ({
      path: i.path,
      message: i.message,
      name: 'ValidationError',
    })),
  });
}

export default factories.createCoreController('api::classroom.classroom', ({ strapi }) => ({
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
      const issues = validateClassroomCandidate(data, { partial: true });
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
