import { factories } from '@strapi/strapi';

import {
  applyDefaultPopulate,
  buildValidationError,
  ensureUniqueDocumentField,
  requireDataPayload,
  uppercaseField,
} from '../../utils/controller-utils';

import type { ValidationIssue, ValidationOptions } from './rule-validation';

type RuleControllerConfig = {
  uid: string;
  duplicateMessage: string;
  duplicateCode: string;
  validate(data: Record<string, unknown>, opts?: ValidationOptions): ValidationIssue[];
};

const defaultPopulate = {
  scheduleConfig: true,
} as const;

export function createRuleController(config: RuleControllerConfig) {
  return factories.createCoreController(config.uid as never, ({ strapi }) => {
    async function validateCode(data: Record<string, unknown>, currentDocumentId?: string) {
      const code = uppercaseField(data, 'code');
      if (!code) return;

      await ensureUniqueDocumentField(
        strapi,
        config.uid as never,
        'code',
        code,
        currentDocumentId,
        config.duplicateMessage,
        config.duplicateCode
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
        const issues = config.validate(data);

        if (issues.length > 0) {
          throw buildValidationError(issues);
        }

        await validateCode(data);
        return super.create(ctx);
      },

      async update(ctx) {
        const data = ctx.request.body?.data as Record<string, unknown> | undefined;
        if (!data) return super.update(ctx);

        const issues = config.validate(data, { partial: true });

        if (issues.length > 0) {
          throw buildValidationError(issues);
        }

        await validateCode(data, ctx.params?.id);
        return super.update(ctx);
      },
    };
  });
}
