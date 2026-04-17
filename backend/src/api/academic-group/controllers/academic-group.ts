import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const defaultListPopulate = {
  course: true,
  teacher: true,
  scheduleConfig: true,
} as const;

function relationPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (typeof value === "object" && value !== null) {
    const o = value as Record<string, unknown>;
    if (Array.isArray(o.connect)) return o.connect.length > 0;
    if (Array.isArray(o.set)) return o.set.length > 0;
    if (typeof o.documentId === "string" && o.documentId.length > 0) return true;
    if (o.id !== undefined && o.id !== null) return true;
    return false;
  }
  return false;
}

function throwMissingRelations(missing: ("course" | "teacher")[]) {
  throw new errors.ValidationError("Validation failed", {
    errors: missing.map((path) => ({
      path: [path],
      message: `${path} is required`,
      name: "ValidationError",
    })),
  });
}

export default factories.createCoreController(
  "api::academic-group.academic-group",
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
      const data = ctx.request.body?.data as Record<string, unknown> | undefined;
      const missing: ("course" | "teacher")[] = [];
      if (!data || !relationPresent(data.course)) missing.push("course");
      if (!data || !relationPresent(data.teacher)) missing.push("teacher");
      if (missing.length) throwMissingRelations(missing);
      return super.create(ctx);
    },
    async update(ctx) {
      const data = ctx.request.body?.data as Record<string, unknown> | undefined;
      if (!data) return super.update(ctx);
      const missing: ("course" | "teacher")[] = [];
      if ("course" in data && !relationPresent(data.course)) missing.push("course");
      if ("teacher" in data && !relationPresent(data.teacher)) missing.push("teacher");
      if (missing.length) throwMissingRelations(missing);
      return super.update(ctx);
    },
  })
);
