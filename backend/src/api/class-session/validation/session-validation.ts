/**
 * Funciones puras de validación de sesiones de clase.
 * Sin dependencias de Strapi para facilitar pruebas unitarias.
 */

export type SessionCandidate = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacherDocumentId?: string | null;
  classroomDocumentId?: string | null;
  academicGroupDocumentId?: string | null;
  sessionDocumentId?: string | null;
};

export type ExistingSession = {
  documentId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacherDocumentId?: string | null;
  classroomDocumentId?: string | null;
  academicGroupDocumentId?: string | null;
};

export type ConflictType = 'teacher' | 'classroom' | 'academicGroup';

export type SessionConflict = {
  type: ConflictType;
  message: string;
  conflictingSession: Pick<ExistingSession, 'documentId' | 'dayOfWeek' | 'startTime' | 'endTime'>;
};

export type ScheduleConfig = {
  weekdayStart: string;
  weekdayEnd: string;
  saturdayStart?: string | null;
  saturdayEnd?: string | null;
  lunchStart: string;
  lunchEnd: string;
};

/**
 * Convierte "HH:MM" o "HH:MM:SS" a minutos desde medianoche.
 * Retorna NaN si el formato es inválido.
 */
export function timeToMinutes(time: string): number {
  const parts = time.split(':');
  if (parts.length < 2) return NaN;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return NaN;
  return hours * 60 + minutes;
}

/**
 * Verifica si dos franjas horarias se solapan (solapamiento estricto; bordes exactos NO solapan).
 * Asume que startA < endA y startB < endB.
 */
export function isTimeOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);

  if (isNaN(sA) || isNaN(eA) || isNaN(sB) || isNaN(eB)) return false;

  return sA < eB && sB < eA;
}

/**
 * Revisa si una sesión candidata tiene conflictos con las sesiones existentes.
 * Excluye la propia sesión cuando se pasa sessionDocumentId (para validaciones de actualización).
 */
export function checkSessionConflicts(
  candidate: SessionCandidate,
  existing: ExistingSession[]
): SessionConflict[] {
  const conflicts: SessionConflict[] = [];

  for (const session of existing) {
    if (candidate.sessionDocumentId && session.documentId === candidate.sessionDocumentId) {
      continue;
    }

    if (session.dayOfWeek !== candidate.dayOfWeek) continue;

    const overlaps = isTimeOverlap(
      candidate.startTime,
      candidate.endTime,
      session.startTime,
      session.endTime
    );

    if (!overlaps) continue;

    if (
      candidate.teacherDocumentId &&
      session.teacherDocumentId &&
      candidate.teacherDocumentId === session.teacherDocumentId
    ) {
      conflicts.push({
        type: 'teacher',
        message: `El docente ya tiene una sesión asignada el día ${candidate.dayOfWeek} entre ${session.startTime} y ${session.endTime}`,
        conflictingSession: {
          documentId: session.documentId,
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
        },
      });
    }

    if (
      candidate.classroomDocumentId &&
      session.classroomDocumentId &&
      candidate.classroomDocumentId === session.classroomDocumentId
    ) {
      conflicts.push({
        type: 'classroom',
        message: `El aula ya está ocupada el día ${candidate.dayOfWeek} entre ${session.startTime} y ${session.endTime}`,
        conflictingSession: {
          documentId: session.documentId,
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
        },
      });
    }

    if (
      candidate.academicGroupDocumentId &&
      session.academicGroupDocumentId &&
      candidate.academicGroupDocumentId === session.academicGroupDocumentId
    ) {
      conflicts.push({
        type: 'academicGroup',
        message: `El grupo académico ya tiene una sesión el día ${candidate.dayOfWeek} entre ${session.startTime} y ${session.endTime}`,
        conflictingSession: {
          documentId: session.documentId,
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
        },
      });
    }
  }

  return conflicts;
}

/**
 * Verifica que una sesión esté dentro del horario permitido por el schedule-config.
 * El día 6 (sábado) usa saturdayStart/saturdayEnd si están definidos.
 * Retorna null si es válido, o un mensaje de error si no lo es.
 */
export function isWithinScheduleHours(
  session: Pick<SessionCandidate, 'dayOfWeek' | 'startTime' | 'endTime'>,
  config: ScheduleConfig
): string | null {
  const isSaturday = session.dayOfWeek === 6;

  let allowedStart: string;
  let allowedEnd: string;

  if (isSaturday) {
    if (!config.saturdayStart || !config.saturdayEnd) {
      return 'El horario no tiene configuración para sábados';
    }
    allowedStart = config.saturdayStart;
    allowedEnd = config.saturdayEnd;
  } else {
    allowedStart = config.weekdayStart;
    allowedEnd = config.weekdayEnd;
  }

  const sSession = timeToMinutes(session.startTime);
  const eSession = timeToMinutes(session.endTime);
  const sAllowed = timeToMinutes(allowedStart);
  const eAllowed = timeToMinutes(allowedEnd);

  if (sSession < sAllowed) {
    return `La sesión comienza antes del horario permitido (${allowedStart})`;
  }

  if (eSession > eAllowed) {
    return `La sesión termina después del horario permitido (${allowedEnd})`;
  }

  return null;
}
