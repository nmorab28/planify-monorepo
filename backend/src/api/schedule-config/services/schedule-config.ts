import { factories } from "@strapi/strapi";

type RuleRecord = {
  documentId: string;
  code: string;
  name: string;
  isEnabled: boolean;
  parameters: Record<string, unknown>;
  weight?: number;
  kind: "hard" | "soft";
};

export default factories.createCoreService(
  "api::schedule-config.schedule-config",
  ({ strapi }) => ({
    async getProcessedRules(scheduleConfigDocumentId: string) {
      const config = await strapi
        .documents("api::schedule-config.schedule-config")
        .findOne({
          documentId: scheduleConfigDocumentId,
          populate: {
            hardRules: true,
            softRules: true,
          },
        });

      if (!config) return null;

      const hardRules = Array.isArray(config.hardRules) ? config.hardRules : [];
      const softRules = Array.isArray(config.softRules) ? config.softRules : [];

      const processedHardRules: RuleRecord[] = hardRules.map((rule) => ({
        kind: "hard",
        documentId: rule.documentId,
        code: rule.code,
        name: rule.name,
        isEnabled: rule.isEnabled ?? true,
        parameters:
          rule.parameters && typeof rule.parameters === "object"
            ? (rule.parameters as Record<string, unknown>)
            : {},
      }));

      const processedSoftRules: RuleRecord[] = softRules.map((rule) => ({
        kind: "soft",
        documentId: rule.documentId,
        code: rule.code,
        name: rule.name,
        isEnabled: rule.isEnabled ?? true,
        weight: rule.weight,
        parameters:
          rule.parameters && typeof rule.parameters === "object"
            ? (rule.parameters as Record<string, unknown>)
            : {},
      }));

      return {
        scheduleConfig: {
          documentId: config.documentId,
          name: config.name,
          academicPeriod: config.academicPeriod,
          isActive: config.isActive,
        },
        rules: [...processedHardRules, ...processedSoftRules],
        hardRules: processedHardRules,
        softRules: processedSoftRules,
      };
    },
  })
);
