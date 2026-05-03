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

    async validateSession(ctx) {
      const body = ctx.request.body as Record<string, unknown> | null;

      if (!body) {
        return ctx.badRequest("Request body is required");
      }

      const { dayOfWeek, startTime, endTime } = body;

      if (typeof dayOfWeek !== "number" || dayOfWeek < 1 || dayOfWeek > 6) {
        return ctx.badRequest("dayOfWeek must be an integer between 1 and 6");
      }

      if (typeof startTime !== "string" || !startTime.trim()) {
        return ctx.badRequest("startTime is required (format HH:MM)");
      }

      if (typeof endTime !== "string" || !endTime.trim()) {
        return ctx.badRequest("endTime is required (format HH:MM)");
      }

      const result = await strapi
        .service("api::class-session.class-session")
        .validateSession({
          dayOfWeek: dayOfWeek as number,
          startTime: startTime as string,
          endTime: endTime as string,
          teacherDocumentId: normalizeDocumentId(body.teacherDocumentId),
          classroomDocumentId: normalizeDocumentId(body.classroomDocumentId),
          academicGroupDocumentId: normalizeDocumentId(
            body.academicGroupDocumentId
          ),
          sessionDocumentId: normalizeDocumentId(body.sessionDocumentId),
        });

      ctx.body = { data: result };
    },
  })
);
