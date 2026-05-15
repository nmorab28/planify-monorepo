import { factories } from '@strapi/strapi';

import {
  applyDefaultPopulate,
  buildValidationError,
  ensureUniqueDocumentField,
  requireDataPayload,
  uppercaseField,
} from '../../../utils/controller-utils';

import { validateSoftRuleCandidate } from '../validation/soft-rule-validation';

const defaultPopulate = {
  scheduleConfig: true,
} as const;

export default factories.createCoreController('api::soft-rule.soft-rule', ({ strapi }) => {
  async function validateCode(data: Record<string, unknown>, currentDocumentId?: string) {
    const code = uppercaseField(data, 'code');
    if (!code) return;

    await ensureUniqueDocumentField(
      strapi,
      'api::soft-rule.soft-rule',
      'code',
      code,
      currentDocumentId,
      'Ya existe una regla blanda con ese codigo.',
      'SOFT_RULE_CODE_DUPLICATED'
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
      const issues = validateSoftRuleCandidate(data);

      if (issues.length > 0) {
        throw buildValidationError(issues);
      }

      await validateCode(data);
      return super.create(ctx);
    },

    async update(ctx) {
      const data = ctx.request.body?.data as Record<string, unknown> | undefined;
      if (!data) return super.update(ctx);

      const issues = validateSoftRuleCandidate(data, { partial: true });

      if (issues.length > 0) {
        throw buildValidationError(issues);
      }

      await validateCode(data, ctx.params?.id);
      return super.update(ctx);
    },
  };
});
