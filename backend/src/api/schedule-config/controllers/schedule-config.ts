import { factories } from "@strapi/strapi";

function normalizeDocumentId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default factories.createCoreController(
  "api::schedule-config.schedule-config",
  ({ strapi }) => ({
    async getProcessedRules(ctx) {
      const scheduleConfigDocumentId = normalizeDocumentId(
        ctx.params.scheduleConfigDocumentId
      );
      if (!scheduleConfigDocumentId) {
        return ctx.badRequest("scheduleConfigDocumentId is required");
      }

      const processedRules = await strapi
        .service("api::schedule-config.schedule-config")
        .getProcessedRules(scheduleConfigDocumentId);

      if (!processedRules) {
        return ctx.notFound("schedule config not found");
      }

      ctx.body = { data: processedRules };
    },

    async validateSchedule(ctx) {
      const scheduleConfigDocumentId = normalizeDocumentId(
        ctx.params.scheduleConfigDocumentId
      );
      if (!scheduleConfigDocumentId) {
        return ctx.badRequest("scheduleConfigDocumentId is required");
      }

      const result = await strapi
        .service("api::schedule-config.schedule-config")
        .validateSchedule(scheduleConfigDocumentId);

      if (!result) {
        return ctx.notFound("schedule config not found");
      }

      ctx.body = { data: result };
    },
  })
);
