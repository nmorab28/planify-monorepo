import type { Core } from '@strapi/strapi';

/** Acciones Content-API concedidas al rol Public al arrancar (idempotente). */
const PUBLIC_CONTENT_API_ACTIONS = [
  'api::classroom-feature.classroom-feature.find',
  'api::classroom-feature.classroom-feature.findOne',
  'api::classroom-feature.classroom-feature.create',
  'api::classroom-feature.classroom-feature.update',
  'api::classroom-feature.classroom-feature.delete',
  'api::academic-group.academic-group.find',
  'api::academic-group.academic-group.findOne',
  'api::academic-group.academic-group.create',
  'api::academic-group.academic-group.update',
  'api::academic-group.academic-group.delete',
  'api::availability.availability.find',
  'api::availability.availability.findOne',
  'api::availability.availability.create',
  'api::availability.availability.update',
  'api::availability.availability.delete',
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

    for (const action of PUBLIC_CONTENT_API_ACTIONS) {
      if (!existing.has(action)) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }
  },
};
