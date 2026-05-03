import { factories } from "@strapi/strapi";
<<<<<<< HEAD
=======
import {
  checkSessionConflicts,
  isWithinScheduleHours,
  type SessionCandidate,
  type ExistingSession,
  type SessionConflict,
} from "../validation/session-validation";
>>>>>>> 8916ee7 (feat(PLN-48): endpoints validar-sesion y validar-horario con pruebas unitarias)

type QueryOptions = {
  sort?: unknown;
  pagination?: unknown;
};

<<<<<<< HEAD
=======
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

>>>>>>> 8916ee7 (feat(PLN-48): endpoints validar-sesion y validar-horario con pruebas unitarias)
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

export default factories.createCoreService(
  "api::class-session.class-session",
  ({ strapi }) => ({
    async findByTeacher(teacherDocumentId: string, options: QueryOptions = {}) {
      return strapi.documents("api::class-session.class-session").findMany({
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
      return strapi.documents("api::class-session.class-session").findMany({
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

    async findByAcademicGroup(
      academicGroupDocumentId: string,
      options: QueryOptions = {}
    ) {
      return strapi.documents("api::class-session.class-session").findMany({
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

    async validateSession(
      input: ValidateSessionInput
    ): Promise<ValidateSessionResult> {
      const rawSessions = await strapi
        .documents("api::class-session.class-session")
        .findMany({ populate: defaultPopulate });

      const existing: ExistingSession[] = rawSessions.map((s) => ({
        documentId: s.documentId,
        dayOfWeek: s.dayOfWeek as number,
        startTime: s.startTime as string,
        endTime: s.endTime as string,
        teacherDocumentId:
          (s.academicGroup as { teacher?: { documentId?: string } } | null)
            ?.teacher?.documentId ?? null,
        classroomDocumentId:
          (s.classroom as { documentId?: string } | null)?.documentId ?? null,
        academicGroupDocumentId:
          (s.academicGroup as { documentId?: string } | null)?.documentId ??
          null,
      }));

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
        const group = await strapi
          .documents("api::academic-group.academic-group")
          .findOne({
            documentId: input.academicGroupDocumentId,
            populate: { scheduleConfig: true },
          });

        const config = (group as { scheduleConfig?: unknown } | null)
          ?.scheduleConfig;

        if (config && typeof config === "object") {
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
                type: "teacher",
                message: scheduleError,
                conflictingSession: {
                  documentId: "",
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
  })
);
