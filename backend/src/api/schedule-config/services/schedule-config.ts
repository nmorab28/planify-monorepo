import { factories } from "@strapi/strapi";
<<<<<<< HEAD
=======
import {
  checkSessionConflicts,
  type ExistingSession,
  type SessionConflict,
} from "../../class-session/validation/session-validation";
>>>>>>> 8916ee7 (feat(PLN-48): endpoints validar-sesion y validar-horario con pruebas unitarias)

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

    async validateSchedule(scheduleConfigDocumentId: string): Promise<{
      valid: boolean;
      totalSessions: number;
      conflicts: Array<
        SessionConflict & {
          sessionA: Pick<ExistingSession, "documentId" | "dayOfWeek" | "startTime" | "endTime">;
          sessionB: Pick<ExistingSession, "documentId" | "dayOfWeek" | "startTime" | "endTime">;
        }
      >;
    } | null> {
      const config = await strapi
        .documents("api::schedule-config.schedule-config")
        .findOne({
          documentId: scheduleConfigDocumentId,
          populate: {
            academicGroups: {
              populate: {
                classSessions: {
                  populate: { classroom: true, academicGroup: { populate: { teacher: true } } },
                },
                teacher: true,
              },
            },
          },
        });

      if (!config) return null;

      const academicGroups = Array.isArray(config.academicGroups)
        ? config.academicGroups
        : [];

      const allSessions: ExistingSession[] = [];

      for (const group of academicGroups) {
        const sessions = Array.isArray(
          (group as { classSessions?: unknown }).classSessions
        )
          ? ((group as { classSessions: unknown[] }).classSessions as Array<{
              documentId: string;
              dayOfWeek: number;
              startTime: string;
              endTime: string;
              classroom?: { documentId?: string };
              academicGroup?: { documentId?: string; teacher?: { documentId?: string } };
            }>)
          : [];

        for (const s of sessions) {
          allSessions.push({
            documentId: s.documentId,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            teacherDocumentId:
              (group as { teacher?: { documentId?: string } }).teacher
                ?.documentId ?? null,
            classroomDocumentId: s.classroom?.documentId ?? null,
            academicGroupDocumentId: (group as { documentId?: string }).documentId ?? null,
          });
        }
      }

      type ScheduleConflict = SessionConflict & {
        sessionA: Pick<ExistingSession, "documentId" | "dayOfWeek" | "startTime" | "endTime">;
        sessionB: Pick<ExistingSession, "documentId" | "dayOfWeek" | "startTime" | "endTime">;
      };

      const conflicts: ScheduleConflict[] = [];
      const reported = new Set<string>();

      for (let i = 0; i < allSessions.length; i++) {
        const sessionA = allSessions[i];
        const rest = allSessions.slice(i + 1);

        const found = checkSessionConflicts(
          {
            dayOfWeek: sessionA.dayOfWeek,
            startTime: sessionA.startTime,
            endTime: sessionA.endTime,
            teacherDocumentId: sessionA.teacherDocumentId,
            classroomDocumentId: sessionA.classroomDocumentId,
            academicGroupDocumentId: sessionA.academicGroupDocumentId,
          },
          rest
        );

        for (const conflict of found) {
          const key = [
            conflict.type,
            sessionA.documentId,
            conflict.conflictingSession.documentId,
          ]
            .sort()
            .join("|");

          if (reported.has(key)) continue;
          reported.add(key);

          conflicts.push({
            ...conflict,
            sessionA: {
              documentId: sessionA.documentId,
              dayOfWeek: sessionA.dayOfWeek,
              startTime: sessionA.startTime,
              endTime: sessionA.endTime,
            },
            sessionB: conflict.conflictingSession,
          });
        }
      }

      return {
        valid: conflicts.length === 0,
        totalSessions: allSessions.length,
        conflicts,
      };
    },
  })
);
