import { describe, expect, it } from 'vitest';

import { validateClassSessionCandidate } from './class-session-management-validation';

describe('validateClassSessionCandidate', () => {
  it('acepta una sesion de clase valida', () => {
    const issues = validateClassSessionCandidate({
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
      sessionOrder: 1,
      status: 'planned',
      isLocked: false,
      academicGroup: 'group-001',
      classroom: 'classroom-001',
    });

    expect(issues).toHaveLength(0);
  });

  it('exige campos minimos al crear', () => {
    const issues = validateClassSessionCandidate({});

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['dayOfWeek'] }),
        expect.objectContaining({ path: ['startTime'] }),
        expect.objectContaining({ path: ['endTime'] }),
        expect.objectContaining({ path: ['academicGroup'] }),
        expect.objectContaining({ path: ['classroom'] }),
      ])
    );
  });

  it('permite actualizaciones parciales', () => {
    expect(validateClassSessionCandidate({}, { partial: true })).toHaveLength(0);
    expect(validateClassSessionCandidate({ status: 'blocked' }, { partial: true })).toHaveLength(0);
  });

  it('rechaza dias y horas invalidas', () => {
    const issues = validateClassSessionCandidate({
      dayOfWeek: 7,
      startTime: '10:00',
      endTime: '09:00',
      academicGroup: 'group-001',
      classroom: 'classroom-001',
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['dayOfWeek'] }),
        expect.objectContaining({ path: ['endTime'] }),
      ])
    );
  });

  it('rechaza status, sessionOrder e isLocked invalidos', () => {
    const issues = validateClassSessionCandidate({
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
      sessionOrder: 0,
      status: 'unknown',
      isLocked: 'no',
      academicGroup: 'group-001',
      classroom: 'classroom-001',
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['sessionOrder'] }),
        expect.objectContaining({ path: ['status'] }),
        expect.objectContaining({ path: ['isLocked'] }),
      ])
    );
  });
});
