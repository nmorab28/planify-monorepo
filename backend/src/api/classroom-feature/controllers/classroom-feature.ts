import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

import { validateClassroomFeatureCandidate } from "../../classroom/validation/classroom-validation";

const defaultListPopulate = {
  classrooms: true,
} as const;

function buildValidationError(issues: { path: string[]; message: string }[]) {
  return new errors.ValidationError("Validation failed", {
    errors: issues.map((i) => ({
      path: i.path,
      message: i.message,
      name: "ValidationError",
    })),
  });
}

export default factories.createCoreController(
  "api::classroom-feature.classroom-feature",
  () => ({
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
      const data = ctx.request.body?.data as
        | Record<string, unknown>
        | undefined;

      if (!data) {
        throw new errors.ValidationError("data is required");
      }

      const issues = validateClassroomFeatureCandidate(data);
      if (issues.length > 0) {
        throw buildValidationError(issues);
      }

      return super.create(ctx);
    },

    async update(ctx) {
      const data = ctx.request.body?.data as
        | Record<string, unknown>
        | undefined;

      if (data) {
        const issues = validateClassroomFeatureCandidate(data, {
          partial: true,
        });
        if (issues.length > 0) {
          throw buildValidationError(issues);
        }
      }

      return super.update(ctx);
    },
  })
);
