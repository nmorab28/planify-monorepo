import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

import { applyDefaultPopulate, buildValidationError } from '../../../utils/controller-utils';

import { validateHardRuleCandidate } from '../validation/hard-rule-validation';

const defaultPopulate = {
  scheduleConfig: true,
} as const;

function normalizeCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.toUpperCase() : null;
}

export default factories.createCoreController('api::hard-rule.hard-rule', ({ strapi }) => {
  async function ensureUniqueCode(code: string, currentDocumentId?: string) {
    const existing = await strapi.documents('api::hard-rule.hard-rule').findMany({
      filters: { code: { $eq: code } },
      fields: ['documentId', 'code'],
      limit: 1,
    });

    const duplicated = Array.isArray(existing)
      ? existing.find((rule) => rule.documentId !== currentDocumentId)
      : null;

    if (duplicated) {
      throw new errors.ValidationError('Ya existe una regla obligatoria con ese codigo.', {
        code: 'HARD_RULE_CODE_DUPLICATED',
      });
    }
  }

  return {

  async find(ctx) {
    applyDefaultPopulate(ctx, defaultPopulate);
    return super.find(ctx);
  },

  async findOne(ctx) {
    applyDefaultPopulate(ctx, defaultPopulate);
    return super.findOne(ctx);
  },

  async create(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;

    if (!data) {
      throw new errors.ValidationError('data is required');
    }

    const issues = validateHardRuleCandidate(data);
    if (issues.length > 0) {
      throw buildValidationError(issues);
    }

    const code = normalizeCode(data.code);
    if (code) {
      data.code = code;
      await ensureUniqueCode(code);
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;

    if (data) {
      const issues = validateHardRuleCandidate(data, { partial: true });
      if (issues.length > 0) {
        throw buildValidationError(issues);
      }

      const code = normalizeCode(data.code);
      if (code) {
        data.code = code;
        await ensureUniqueCode(code, ctx.params?.id);
      }
    }

    return super.update(ctx);
  },
  };
});
