import { factories } from '@strapi/strapi';

import {
  applyDefaultPopulate,
  buildValidationError,
  ensureUniqueDocumentField,
  requireDataPayload,
  uppercaseField,
} from '../../../utils/controller-utils';

import { validateHardRuleCandidate } from '../validation/hard-rule-validation';

const defaultPopulate = {
  scheduleConfig: true,
} as const;

export default factories.createCoreController('api::hard-rule.hard-rule', ({ strapi }) => {
  async function validateCode(data: Record<string, unknown>, currentDocumentId?: string) {
    const code = uppercaseField(data, 'code');
    if (!code) return;

    await ensureUniqueDocumentField(
      strapi,
      'api::hard-rule.hard-rule',
      'code',
      code,
      currentDocumentId,
      'Ya existe una regla obligatoria con ese codigo.',
      'HARD_RULE_CODE_DUPLICATED'
    );
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
      const data = requireDataPayload(ctx);
      const issues = validateHardRuleCandidate(data);
      if (issues.length > 0) {
        throw buildValidationError(issues);
      }

      await validateCode(data);
      return super.create(ctx);
    },

    async update(ctx) {
      const data = ctx.request.body?.data as Record<string, unknown> | undefined;
      if (!data) return super.update(ctx);

      const issues = validateHardRuleCandidate(data, { partial: true });
      if (issues.length > 0) {
        throw buildValidationError(issues);
      }

      await validateCode(data, ctx.params?.id);
      return super.update(ctx);
    },
  };
});
