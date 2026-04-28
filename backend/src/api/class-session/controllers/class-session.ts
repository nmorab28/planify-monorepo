import { factories } from "@strapi/strapi";

function normalizeDocumentId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function pickQueryOptions(query: Record<string, unknown>) {
  return {
    sort: query.sort,
    pagination: query.pagination,
  };
}

export default factories.createCoreController(
  "api::class-session.class-session",
  ({ strapi }) => ({
    async findByTeacher(ctx) {
      const teacherDocumentId = normalizeDocumentId(ctx.params.teacherDocumentId);
      if (!teacherDocumentId) return ctx.badRequest("teacherDocumentId is required");

      const sessions = await strapi
        .service("api::class-session.class-session")
        .findByTeacher(teacherDocumentId, pickQueryOptions(ctx.query as Record<string, unknown>));

      ctx.body = { data: sessions };
    },

    async findByClassroom(ctx) {
      const classroomDocumentId = normalizeDocumentId(ctx.params.classroomDocumentId);
      if (!classroomDocumentId) return ctx.badRequest("classroomDocumentId is required");

      const sessions = await strapi
        .service("api::class-session.class-session")
        .findByClassroom(
          classroomDocumentId,
          pickQueryOptions(ctx.query as Record<string, unknown>)
        );

      ctx.body = { data: sessions };
    },

    async findByAcademicGroup(ctx) {
      const academicGroupDocumentId = normalizeDocumentId(
        ctx.params.academicGroupDocumentId
      );
      if (!academicGroupDocumentId) {
        return ctx.badRequest("academicGroupDocumentId is required");
      }

      const sessions = await strapi
        .service("api::class-session.class-session")
        .findByAcademicGroup(
          academicGroupDocumentId,
          pickQueryOptions(ctx.query as Record<string, unknown>)
        );

      ctx.body = { data: sessions };
    },
  })
);
