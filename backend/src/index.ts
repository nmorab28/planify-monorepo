import type { Core } from '@strapi/strapi';

/** Content-API actions for classroom-feature (rol Public por defecto). Idempotente. */
const CLASSROOM_FEATURE_PUBLIC_ACTIONS = [
  'api::classroom-feature.classroom-feature.find',
  'api::classroom-feature.classroom-feature.findOne',
  'api::classroom-feature.classroom-feature.create',
  'api::classroom-feature.classroom-feature.update',
  'api::classroom-feature.classroom-feature.delete',
] as const;

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
      populate: ['permissions'],
    });
    if (!publicRole?.id) return;

    const existing = new Set(
      (publicRole.permissions ?? []).map((p: { action: string }) => p.action)
    );

    for (const action of CLASSROOM_FEATURE_PUBLIC_ACTIONS) {
      if (!existing.has(action)) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }
  },
};
