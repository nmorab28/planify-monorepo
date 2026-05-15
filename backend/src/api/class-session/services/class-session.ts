import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';
import {
  checkSessionConflicts,
  isSessionCoveredByAvailability,
  isWithinScheduleHours,
  type SessionCandidate,
  type ExistingSession,
  type SessionConflict,
  type TeacherAvailability,
} from '../validation/session-validation';

type QueryOptions = {
  sort?: unknown;
  pagination?: unknown;
};

export type ValidateSessionInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacherDocumentId?: string | null;
  classroomDocumentId?: string | null;
  academicGroupDocumentId?: string | null;
  sessionDocumentId?: string | null;
};

export type ValidateSessionResult = {
  valid: boolean;
  conflicts: SessionConflict[];
};

export type PersistedClassSession = {
  documentId: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  academicGroup?: {
    documentId?: string;
    teacher?: { documentId?: string } | null;
  } | null;
  classroom?: { documentId?: string } | null;
};

export type ScheduleConflictInput = {
  data: Record<string, unknown>;
  currentSessionDocumentId?: string;
};

export type TeacherAvailabilityInput = ScheduleConflictInput;
export type ClassroomCapacityInput = ScheduleConflictInput;

type AcademicGroupDetails = {
  documentId: string;
  capacityTarget?: number | null;
  teacher?: { documentId?: string } | null;
};

type ClassroomDetails = {
  documentId: string;
  capacity?: number | null;
};

const defaultPopulate = {
  academicGroup: {
    populate: {
      course: true,
      teacher: true,
      scheduleConfig: true,
    },
  },
  classroom: true,
} as const;

function readRelationDocumentId(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();

  if (typeof value !== 'object' || value === null) return null;

  const relation = value as {
    documentId?: unknown;
    connect?: unknown[];
    set?: unknown[];
  };

  if (typeof relation.documentId === 'string' && relation.documentId.trim().length > 0) {
    return relation.documentId.trim();
  }

  const candidates = Array.isArray(relation.set) ? relation.set : relation.connect;
  const firstCandidate = Array.isArray(candidates) ? candidates[0] : null;

  if (typeof firstCandidate === 'string' && firstCandidate.trim().length > 0) {
    return firstCandidate.trim();
  }

  if (typeof firstCandidate === 'object' && firstCandidate !== null) {
    const documentId = (firstCandidate as { documentId?: unknown }).documentId;
    if (typeof documentId === 'string' && documentId.trim().length > 0) {
      return documentId.trim();
    }
  }

  return null;
}

function mapExistingSession(session: PersistedClassSession): ExistingSession {
  return {
    documentId: session.documentId,
    dayOfWeek: session.dayOfWeek as number,
    startTime: session.startTime as string,
    endTime: session.endTime as string,
    teacherDocumentId: session.academicGroup?.teacher?.documentId ?? null,
    classroomDocumentId: session.classroom?.documentId ?? null,
    academicGroupDocumentId: session.academicGroup?.documentId ?? null,
  };
}

async function resolveSessionContext(
  strapi: Core.Strapi,
  input: ScheduleConflictInput
) {
  const currentSession = input.currentSessionDocumentId
    ? ((await strapi.documents('api::class-session.class-session').findOne({
        documentId: input.currentSessionDocumentId,
        populate: defaultPopulate,
      })) as PersistedClassSession | null)
    : null;

  const academicGroupDocumentId =
    readRelationDocumentId(input.data.academicGroup) ??
    currentSession?.academicGroup?.documentId ??
    null;
  const classroomDocumentId =
    readRelationDocumentId(input.data.classroom) ?? currentSession?.classroom?.documentId ?? null;

  const academicGroup = academicGroupDocumentId
    ? ((await strapi.documents('api::academic-group.academic-group').findOne({
        documentId: academicGroupDocumentId,
        populate: { teacher: true },
      })) as AcademicGroupDetails | null)
    : null;

  return {
    currentSession,
    academicGroupDocumentId,
    classroomDocumentId,
    teacherDocumentId:
      academicGroup?.teacher?.documentId ??
      currentSession?.academicGroup?.teacher?.documentId ??
      null,
    dayOfWeek: Number(input.data.dayOfWeek ?? currentSession?.dayOfWeek),
    startTime: String(input.data.startTime ?? currentSession?.startTime),
    endTime: String(input.data.endTime ?? currentSession?.endTime),
  };
}

export default factories.createCoreService('api::class-session.class-session', ({ strapi }) => ({
  async findByTeacher(teacherDocumentId: string, options: QueryOptions = {}) {
    return strapi.documents('api::class-session.class-session').findMany({
      sort: options.sort,
      pagination: options.pagination,
      populate: defaultPopulate,
      filters: {
        academicGroup: {
          teacher: {
            documentId: { $eq: teacherDocumentId },
          },
        },
      },
    });
  },

  async findByClassroom(classroomDocumentId: string, options: QueryOptions = {}) {
    return strapi.documents('api::class-session.class-session').findMany({
      sort: options.sort,
      pagination: options.pagination,
      populate: defaultPopulate,
      filters: {
        classroom: {
          documentId: { $eq: classroomDocumentId },
        },
      },
    });
  },

  async findByAcademicGroup(academicGroupDocumentId: string, options: QueryOptions = {}) {
    return strapi.documents('api::class-session.class-session').findMany({
      sort: options.sort,
      pagination: options.pagination,
      populate: defaultPopulate,
      filters: {
        academicGroup: {
          documentId: { $eq: academicGroupDocumentId },
        },
      },
    });
  },

  async validateSession(input: ValidateSessionInput): Promise<ValidateSessionResult> {
    const rawSessions = await strapi
      .documents('api::class-session.class-session')
      .findMany({ populate: defaultPopulate });

    const existing: ExistingSession[] = (rawSessions as PersistedClassSession[]).map(
      mapExistingSession
    );

    const candidate: SessionCandidate = {
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      teacherDocumentId: input.teacherDocumentId,
      classroomDocumentId: input.classroomDocumentId,
      academicGroupDocumentId: input.academicGroupDocumentId,
      sessionDocumentId: input.sessionDocumentId,
    };

    const conflicts = checkSessionConflicts(candidate, existing);

    if (input.academicGroupDocumentId) {
      const group = await strapi.documents('api::academic-group.academic-group').findOne({
        documentId: input.academicGroupDocumentId,
        populate: { scheduleConfig: true },
      });

      const config = (group as { scheduleConfig?: unknown } | null)?.scheduleConfig;

      if (config && typeof config === 'object') {
        const schedConfig = config as {
          weekdayStart?: string;
          weekdayEnd?: string;
          saturdayStart?: string | null;
          saturdayEnd?: string | null;
          lunchStart?: string;
          lunchEnd?: string;
        };

        if (
          schedConfig.weekdayStart &&
          schedConfig.weekdayEnd &&
          schedConfig.lunchStart &&
          schedConfig.lunchEnd
        ) {
          const scheduleError = isWithinScheduleHours(
            {
              dayOfWeek: input.dayOfWeek,
              startTime: input.startTime,
              endTime: input.endTime,
            },
            {
              weekdayStart: schedConfig.weekdayStart,
              weekdayEnd: schedConfig.weekdayEnd,
              saturdayStart: schedConfig.saturdayStart,
              saturdayEnd: schedConfig.saturdayEnd,
              lunchStart: schedConfig.lunchStart,
              lunchEnd: schedConfig.lunchEnd,
            }
          );

          if (scheduleError) {
            conflicts.push({
              type: 'teacher',
              message: scheduleError,
              conflictingSession: {
                documentId: '',
                dayOfWeek: input.dayOfWeek,
                startTime: input.startTime,
                endTime: input.endTime,
              },
            });
          }
        }
      }
    }

    return { valid: conflicts.length === 0, conflicts };
  },

  async findScheduleConflicts(input: ScheduleConflictInput): Promise<SessionConflict[]> {
    const sessionContext = await resolveSessionContext(strapi, input);

    const rawSessions = (await strapi.documents('api::class-session.class-session').findMany({
      populate: defaultPopulate,
    })) as PersistedClassSession[];

    return checkSessionConflicts(
      {
        dayOfWeek: sessionContext.dayOfWeek,
        startTime: sessionContext.startTime,
        endTime: sessionContext.endTime,
        teacherDocumentId: sessionContext.teacherDocumentId,
        classroomDocumentId: sessionContext.classroomDocumentId,
        academicGroupDocumentId: sessionContext.academicGroupDocumentId,
        sessionDocumentId: input.currentSessionDocumentId,
      },
      rawSessions.map(mapExistingSession)
    );
  },

  async findTeacherAvailabilityIssues(input: TeacherAvailabilityInput): Promise<string[]> {
    const sessionContext = await resolveSessionContext(strapi, input);

    if (!sessionContext.teacherDocumentId) {
      return [];
    }

    const availabilitySlots = (await strapi.documents('api::availability.availability').findMany({
      filters: {
        dayOfWeek: { $eq: sessionContext.dayOfWeek },
        isAvailable: { $eq: true },
        teacher: {
          documentId: { $eq: sessionContext.teacherDocumentId },
        },
      },
      fields: ['dayOfWeek', 'startTime', 'endTime', 'isAvailable'],
    } as never)) as TeacherAvailability[];

    const isCovered = isSessionCoveredByAvailability(
      {
        dayOfWeek: sessionContext.dayOfWeek,
        startTime: sessionContext.startTime,
        endTime: sessionContext.endTime,
      },
      availabilitySlots
    );

    return isCovered
      ? []
      : [
          `El docente no tiene disponibilidad para el dia ${sessionContext.dayOfWeek} entre ${sessionContext.startTime} y ${sessionContext.endTime}.`,
        ];
  },

  async findClassroomCapacityIssues(input: ClassroomCapacityInput): Promise<string[]> {
    const sessionContext = await resolveSessionContext(strapi, input);

    if (!sessionContext.academicGroupDocumentId || !sessionContext.classroomDocumentId) {
      return [];
    }

    const [academicGroup, classroom] = await Promise.all([
      strapi.documents('api::academic-group.academic-group').findOne({
        documentId: sessionContext.academicGroupDocumentId,
        fields: ['capacityTarget'],
      }) as Promise<AcademicGroupDetails | null>,
      strapi.documents('api::classroom.classroom').findOne({
        documentId: sessionContext.classroomDocumentId,
        fields: ['capacity'],
      }) as Promise<ClassroomDetails | null>,
    ]);

    const capacityTarget = academicGroup?.capacityTarget;
    const classroomCapacity = classroom?.capacity;

    if (typeof capacityTarget !== 'number' || typeof classroomCapacity !== 'number') {
      return [];
    }

    return classroomCapacity >= capacityTarget
      ? []
      : [
          `El aula seleccionada tiene capacidad ${classroomCapacity}, pero el grupo requiere ${capacityTarget} estudiantes.`,
        ];
  },
}));
