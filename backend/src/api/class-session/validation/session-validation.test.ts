import { describe, it, expect } from "vitest";
import {
  isTimeOverlap,
  checkSessionConflicts,
  isWithinScheduleHours,
  timeToMinutes,
  type ExistingSession,
  type SessionCandidate,
  type ScheduleConfig,
} from "./session-validation";

// ---------------------------------------------------------------------------
// timeToMinutes
// ---------------------------------------------------------------------------
describe("timeToMinutes", () => {
  it("convierte HH:MM correctamente", () => {
    expect(timeToMinutes("08:00")).toBe(480);
    expect(timeToMinutes("13:30")).toBe(810);
    expect(timeToMinutes("00:00")).toBe(0);
  });

  it("acepta formato HH:MM:SS ignorando segundos", () => {
    expect(timeToMinutes("08:00:00")).toBe(480);
  });

  it("retorna NaN para formato inválido", () => {
    expect(timeToMinutes("invalid")).toBeNaN();
    expect(timeToMinutes("")).toBeNaN();
  });
});

// ---------------------------------------------------------------------------
// isTimeOverlap
// ---------------------------------------------------------------------------
describe("isTimeOverlap", () => {
  it("detecta solapamiento parcial (B empieza antes de que A termine)", () => {
    expect(isTimeOverlap("08:00", "10:00", "09:00", "11:00")).toBe(true);
  });

  it("detecta solapamiento parcial inverso (A empieza antes de que B termine)", () => {
    expect(isTimeOverlap("09:00", "11:00", "08:00", "10:00")).toBe(true);
  });

  it("detecta solapamiento total (B dentro de A)", () => {
    expect(isTimeOverlap("08:00", "12:00", "09:00", "11:00")).toBe(true);
  });

  it("detecta solapamiento total (A dentro de B)", () => {
    expect(isTimeOverlap("09:00", "11:00", "08:00", "12:00")).toBe(true);
  });

  it("NO hay solapamiento cuando A termina justo cuando B empieza (borde exacto)", () => {
    expect(isTimeOverlap("08:00", "10:00", "10:00", "12:00")).toBe(false);
  });

  it("NO hay solapamiento cuando B termina justo cuando A empieza", () => {
    expect(isTimeOverlap("10:00", "12:00", "08:00", "10:00")).toBe(false);
  });

  it("NO hay solapamiento cuando las franjas no se tocan", () => {
    expect(isTimeOverlap("08:00", "09:00", "10:00", "11:00")).toBe(false);
  });

  it("retorna false si algún tiempo es inválido", () => {
    expect(isTimeOverlap("invalid", "10:00", "08:00", "09:00")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// checkSessionConflicts
// ---------------------------------------------------------------------------

const BASE_SESSION: ExistingSession = {
  documentId: "session-001",
  dayOfWeek: 1,
  startTime: "08:00",
  endTime: "10:00",
  teacherDocumentId: "teacher-001",
  classroomDocumentId: "classroom-001",
  academicGroupDocumentId: "group-001",
};

describe("checkSessionConflicts", () => {
  it("retorna array vacío cuando no hay conflictos (diferente día)", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 2,
      startTime: "08:00",
      endTime: "10:00",
      teacherDocumentId: "teacher-001",
      classroomDocumentId: "classroom-001",
      academicGroupDocumentId: "group-001",
    };
    expect(checkSessionConflicts(candidate, [BASE_SESSION])).toHaveLength(0);
  });

  it("retorna array vacío cuando no hay conflictos (sin solapamiento horario)", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "10:00",
      endTime: "12:00",
      teacherDocumentId: "teacher-001",
    };
    expect(checkSessionConflicts(candidate, [BASE_SESSION])).toHaveLength(0);
  });

  it("detecta conflicto de docente", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "11:00",
      teacherDocumentId: "teacher-001",
      classroomDocumentId: "classroom-999",
      academicGroupDocumentId: "group-999",
    };
    const conflicts = checkSessionConflicts(candidate, [BASE_SESSION]);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].type).toBe("teacher");
    expect(conflicts[0].conflictingSession.documentId).toBe("session-001");
  });

  it("detecta conflicto de aula", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "11:00",
      teacherDocumentId: "teacher-999",
      classroomDocumentId: "classroom-001",
      academicGroupDocumentId: "group-999",
    };
    const conflicts = checkSessionConflicts(candidate, [BASE_SESSION]);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].type).toBe("classroom");
  });

  it("detecta conflicto de grupo académico", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "11:00",
      teacherDocumentId: "teacher-999",
      classroomDocumentId: "classroom-999",
      academicGroupDocumentId: "group-001",
    };
    const conflicts = checkSessionConflicts(candidate, [BASE_SESSION]);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].type).toBe("academicGroup");
  });

  it("detecta múltiples conflictos simultáneos (docente + aula + grupo)", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "11:00",
      teacherDocumentId: "teacher-001",
      classroomDocumentId: "classroom-001",
      academicGroupDocumentId: "group-001",
    };
    const conflicts = checkSessionConflicts(candidate, [BASE_SESSION]);
    expect(conflicts).toHaveLength(3);
    const types = conflicts.map((c) => c.type);
    expect(types).toContain("teacher");
    expect(types).toContain("classroom");
    expect(types).toContain("academicGroup");
  });

  it("excluye la propia sesión cuando se pasa sessionDocumentId", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "10:00",
      teacherDocumentId: "teacher-001",
      classroomDocumentId: "classroom-001",
      academicGroupDocumentId: "group-001",
      sessionDocumentId: "session-001",
    };
    expect(checkSessionConflicts(candidate, [BASE_SESSION])).toHaveLength(0);
  });

  it("retorna array vacío con lista de sesiones vacía", () => {
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "10:00",
      teacherDocumentId: "teacher-001",
    };
    expect(checkSessionConflicts(candidate, [])).toHaveLength(0);
  });

  it("no reporta conflicto si teacherDocumentId es null en la sesión existente", () => {
    const existing: ExistingSession = {
      ...BASE_SESSION,
      teacherDocumentId: null,
    };
    const candidate: SessionCandidate = {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "11:00",
      teacherDocumentId: "teacher-001",
      classroomDocumentId: "classroom-999",
      academicGroupDocumentId: "group-999",
    };
    expect(checkSessionConflicts(candidate, [existing])).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// isWithinScheduleHours
// ---------------------------------------------------------------------------

const BASE_CONFIG: ScheduleConfig = {
  weekdayStart: "07:00",
  weekdayEnd: "21:00",
  lunchStart: "12:00",
  lunchEnd: "14:00",
  saturdayStart: "07:00",
  saturdayEnd: "13:00",
};

describe("isWithinScheduleHours", () => {
  it("retorna null (válido) cuando la sesión está dentro del horario", () => {
    expect(
      isWithinScheduleHours({ dayOfWeek: 1, startTime: "08:00", endTime: "10:00" }, BASE_CONFIG)
    ).toBeNull();
  });

  it("retorna error cuando la sesión empieza antes del inicio permitido", () => {
    const result = isWithinScheduleHours(
      { dayOfWeek: 1, startTime: "06:00", endTime: "08:00" },
      BASE_CONFIG
    );
    expect(result).not.toBeNull();
    expect(result).toMatch(/antes del horario/);
  });

  it("retorna error cuando la sesión termina después del cierre", () => {
    const result = isWithinScheduleHours(
      { dayOfWeek: 1, startTime: "20:00", endTime: "22:00" },
      BASE_CONFIG
    );
    expect(result).not.toBeNull();
    expect(result).toMatch(/después del horario/);
  });

  it("acepta sesiones en los bordes exactos del horario", () => {
    expect(
      isWithinScheduleHours({ dayOfWeek: 1, startTime: "07:00", endTime: "21:00" }, BASE_CONFIG)
    ).toBeNull();
  });

  it("usa horario de sábado para día 6", () => {
    expect(
      isWithinScheduleHours({ dayOfWeek: 6, startTime: "08:00", endTime: "10:00" }, BASE_CONFIG)
    ).toBeNull();
  });

  it("retorna error si el sábado no está configurado y se intenta agendar", () => {
    const configSinSabado: ScheduleConfig = { ...BASE_CONFIG, saturdayStart: null, saturdayEnd: null };
    const result = isWithinScheduleHours(
      { dayOfWeek: 6, startTime: "08:00", endTime: "10:00" },
      configSinSabado
    );
    expect(result).not.toBeNull();
    expect(result).toMatch(/sábados/);
  });

  it("retorna error cuando sesión de sábado termina después del cierre de sábado", () => {
    const result = isWithinScheduleHours(
      { dayOfWeek: 6, startTime: "12:00", endTime: "14:00" },
      BASE_CONFIG
    );
    expect(result).not.toBeNull();
    expect(result).toMatch(/después del horario/);
  });
});
