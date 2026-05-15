import { factories } from '@strapi/strapi';

import {
  applyDefaultPopulate,
  buildValidationError,
  requireDataPayload,
} from '../../../utils/controller-utils';
import type { SessionConflict } from '../validation/session-validation';
import { validateClassSessionCandidate } from '../validation/class-session-management-validation';

const defaultPopulate = {
  academicGroup: {
    populate: {
      course: true,
      teacher: true,
    },
  },
  classroom: true,
} as const;

function normalizeDocumentId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function pickQueryOptions(query: Record<string, unknown>) {
  return {
    sort: query.sort,
    pagination: query.pagination,
  };
}

function buildConflictIssues(conflicts: SessionConflict[]) {
  return conflicts.map((conflict) => ({
    path: ['scheduleConflict', conflict.type],
    message: conflict.message,
  }));
}

function buildTeacherAvailabilityIssues(messages: string[]) {
  return buildMessageIssues(['teacherAvailability'], messages);
}

function buildClassroomCapacityIssues(messages: string[]) {
  return buildMessageIssues(['classroomCapacity'], messages);
}

function buildMessageIssues(path: string[], messages: string[]) {
  return messages.map((message) => ({
    path,
    message,
  }));
}

export default factories.createCoreController('api::class-session.class-session', ({ strapi }) => ({
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
    const issues = validateClassSessionCandidate(data);

    if (issues.length > 0) {
      throw buildValidationError(issues);
    }

    const conflicts = await strapi
      .service('api::class-session.class-session')
      .findScheduleConflicts({ data });

    if (conflicts.length > 0) {
      throw buildValidationError(buildConflictIssues(conflicts));
    }

    const availabilityIssues = await strapi
      .service('api::class-session.class-session')
      .findTeacherAvailabilityIssues({ data });

    if (availabilityIssues.length > 0) {
      throw buildValidationError(buildTeacherAvailabilityIssues(availabilityIssues));
    }

    const capacityIssues = await strapi
      .service('api::class-session.class-session')
      .findClassroomCapacityIssues({ data });

    if (capacityIssues.length > 0) {
      throw buildValidationError(buildClassroomCapacityIssues(capacityIssues));
    }

    applyDefaultPopulate(ctx, defaultPopulate);
    return super.create(ctx);
  },

  async update(ctx) {
    const data = ctx.request.body?.data as Record<string, unknown> | undefined;

    if (data) {
      const issues = validateClassSessionCandidate(data, { partial: true });

      if (issues.length > 0) {
        throw buildValidationError(issues);
      }

      const conflicts = await strapi
        .service('api::class-session.class-session')
        .findScheduleConflicts({
          data,
          currentSessionDocumentId: ctx.params?.id,
        });

      if (conflicts.length > 0) {
        throw buildValidationError(buildConflictIssues(conflicts));
      }

      const availabilityIssues = await strapi
        .service('api::class-session.class-session')
        .findTeacherAvailabilityIssues({
          data,
          currentSessionDocumentId: ctx.params?.id,
        });

      if (availabilityIssues.length > 0) {
        throw buildValidationError(buildTeacherAvailabilityIssues(availabilityIssues));
      }

      const capacityIssues = await strapi
        .service('api::class-session.class-session')
        .findClassroomCapacityIssues({
          data,
          currentSessionDocumentId: ctx.params?.id,
        });

      if (capacityIssues.length > 0) {
        throw buildValidationError(buildClassroomCapacityIssues(capacityIssues));
      }
    }

    applyDefaultPopulate(ctx, defaultPopulate);
    return super.update(ctx);
  },

  async findByTeacher(ctx) {
    const teacherDocumentId = normalizeDocumentId(ctx.params.teacherDocumentId);
    if (!teacherDocumentId) return ctx.badRequest('teacherDocumentId is required');

    const sessions = await strapi
      .service('api::class-session.class-session')
      .findByTeacher(teacherDocumentId, pickQueryOptions(ctx.query as Record<string, unknown>));

    ctx.body = { data: sessions };
  },

  async findByClassroom(ctx) {
    const classroomDocumentId = normalizeDocumentId(ctx.params.classroomDocumentId);
    if (!classroomDocumentId) return ctx.badRequest('classroomDocumentId is required');

    const sessions = await strapi
      .service('api::class-session.class-session')
      .findByClassroom(classroomDocumentId, pickQueryOptions(ctx.query as Record<string, unknown>));

    ctx.body = { data: sessions };
  },

  async findByAcademicGroup(ctx) {
    const academicGroupDocumentId = normalizeDocumentId(ctx.params.academicGroupDocumentId);
    if (!academicGroupDocumentId) {
      return ctx.badRequest('academicGroupDocumentId is required');
    }

    const sessions = await strapi
      .service('api::class-session.class-session')
      .findByAcademicGroup(
        academicGroupDocumentId,
        pickQueryOptions(ctx.query as Record<string, unknown>)
      );

    ctx.body = { data: sessions };
  },

  async validateSession(ctx) {
    const body = ctx.request.body as Record<string, unknown> | null;

    if (!body) {
      return ctx.badRequest('Request body is required');
    }

    const { dayOfWeek, startTime, endTime } = body;

    if (typeof dayOfWeek !== 'number' || dayOfWeek < 1 || dayOfWeek > 6) {
      return ctx.badRequest('dayOfWeek must be an integer between 1 and 6');
    }

    if (typeof startTime !== 'string' || !startTime.trim()) {
      return ctx.badRequest('startTime is required (format HH:MM)');
    }

    if (typeof endTime !== 'string' || !endTime.trim()) {
      return ctx.badRequest('endTime is required (format HH:MM)');
    }

    const result = await strapi.service('api::class-session.class-session').validateSession({
      dayOfWeek: dayOfWeek as number,
      startTime: startTime as string,
      endTime: endTime as string,
      teacherDocumentId: normalizeDocumentId(body.teacherDocumentId),
      classroomDocumentId: normalizeDocumentId(body.classroomDocumentId),
      academicGroupDocumentId: normalizeDocumentId(body.academicGroupDocumentId),
      sessionDocumentId: normalizeDocumentId(body.sessionDocumentId),
    });

    ctx.body = { data: result };
  },
}));
