import { describe, it, expect } from 'vitest';
import {
  validateClassroomCandidate,
  validateClassroomFeatureCandidate,
} from './classroom-validation';

// ---------------------------------------------------------------------------
// validateClassroomCandidate — caso feliz
// ---------------------------------------------------------------------------
describe('validateClassroomCandidate — caso feliz', () => {
  it('retorna array vacío con un candidato válido', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      name: 'Aula Magna',
      capacity: 60,
    });
    expect(issues).toHaveLength(0);
  });

  it('acepta capacity como string numérico', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      name: 'Aula Magna',
      capacity: '60',
    });
    expect(issues).toHaveLength(0);
  });

  it('acepta los bordes válidos de capacidad (1 y 1000)', () => {
    expect(validateClassroomCandidate({ code: 'A1', name: 'Mini', capacity: 1 })).toHaveLength(0);
    expect(
      validateClassroomCandidate({ code: 'A2', name: 'Coliseo', capacity: 1000 })
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// validateClassroomCandidate — code
// ---------------------------------------------------------------------------
describe('validateClassroomCandidate — code', () => {
  it('reporta error si code está ausente', () => {
    const issues = validateClassroomCandidate({
      name: 'Aula',
      capacity: 30,
    });
    const codeIssue = issues.find((i) => i.path[0] === 'code');
    expect(codeIssue).toBeDefined();
    expect(codeIssue?.message).toMatch(/obligatorio/);
  });

  it('reporta error si code está vacío o sólo espacios', () => {
    expect(validateClassroomCandidate({ code: '', name: 'Aula', capacity: 30 })).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['code'] })])
    );
    expect(validateClassroomCandidate({ code: '   ', name: 'Aula', capacity: 30 })).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['code'] })])
    );
  });

  it('reporta error si code tiene minúsculas o espacios', () => {
    const issues = validateClassroomCandidate({
      code: 'aula 101',
      name: 'Aula',
      capacity: 30,
    });
    const codeIssue = issues.find((i) => i.path[0] === 'code');
    expect(codeIssue).toBeDefined();
    expect(codeIssue?.message).toMatch(/may[uú]sculas/);
  });

  it('reporta error si code tiene caracteres especiales', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA@101',
      name: 'Aula',
      capacity: 30,
    });
    expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['code'] })]));
  });

  it('reporta error si code es demasiado corto o largo', () => {
    expect(validateClassroomCandidate({ code: 'A', name: 'Aula', capacity: 30 })).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['code'] })])
    );
    expect(
      validateClassroomCandidate({
        code: 'A'.repeat(21),
        name: 'Aula',
        capacity: 30,
      })
    ).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['code'] })]));
  });

  it('reporta error si code no es string', () => {
    const issues = validateClassroomCandidate({
      code: 123 as unknown as string,
      name: 'Aula',
      capacity: 30,
    });
    expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['code'] })]));
  });
});

// ---------------------------------------------------------------------------
// validateClassroomCandidate — name
// ---------------------------------------------------------------------------
describe('validateClassroomCandidate — name', () => {
  it('reporta error si name está ausente', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      capacity: 30,
    });
    expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['name'] })]));
  });

  it('reporta error si name es muy corto (1 char)', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      name: 'A',
      capacity: 30,
    });
    expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['name'] })]));
  });

  it('reporta error si name supera 120 caracteres', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      name: 'A'.repeat(121),
      capacity: 30,
    });
    expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['name'] })]));
  });
});

// ---------------------------------------------------------------------------
// validateClassroomCandidate — capacity
// ---------------------------------------------------------------------------
describe('validateClassroomCandidate — capacity', () => {
  it('reporta error si capacity está ausente', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      name: 'Aula',
    });
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['capacity'] })])
    );
  });

  it('reporta error si capacity no es número (string no numérico)', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      name: 'Aula',
      capacity: 'treinta',
    });
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['capacity'] })])
    );
  });

  it('reporta error si capacity es 0 o negativo', () => {
    expect(
      validateClassroomCandidate({
        code: 'AULA-101',
        name: 'Aula',
        capacity: 0,
      })
    ).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['capacity'] })]));
    expect(
      validateClassroomCandidate({
        code: 'AULA-101',
        name: 'Aula',
        capacity: -5,
      })
    ).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['capacity'] })]));
  });

  it('reporta error si capacity > 1000', () => {
    const issues = validateClassroomCandidate({
      code: 'AULA-101',
      name: 'Aula',
      capacity: 1001,
    });
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['capacity'] })])
    );
  });
});

// ---------------------------------------------------------------------------
// validateClassroomCandidate — modo partial
// ---------------------------------------------------------------------------
describe('validateClassroomCandidate — modo partial (update)', () => {
  it('no exige campos ausentes en partial', () => {
    expect(validateClassroomCandidate({}, { partial: true })).toHaveLength(0);
  });

  it('valida igualmente los campos presentes en partial', () => {
    const issues = validateClassroomCandidate({ capacity: -10 }, { partial: true });
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['capacity'] })])
    );
  });

  it('acepta una actualización parcial sólo del nombre', () => {
    expect(validateClassroomCandidate({ name: 'Aula renombrada' }, { partial: true })).toHaveLength(
      0
    );
  });
});

// ---------------------------------------------------------------------------
// validateClassroomFeatureCandidate
// ---------------------------------------------------------------------------
describe('validateClassroomFeatureCandidate', () => {
  it('acepta un candidato válido', () => {
    expect(
      validateClassroomFeatureCandidate({
        code: 'PROYECTOR',
        name: 'Proyector HDMI',
      })
    ).toHaveLength(0);
  });

  it('exige code y name por defecto', () => {
    const issues = validateClassroomFeatureCandidate({});
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['code'] }),
        expect.objectContaining({ path: ['name'] }),
      ])
    );
  });

  it('rechaza code con formato inválido', () => {
    const issues = validateClassroomFeatureCandidate({
      code: 'proy ector',
      name: 'Proyector',
    });
    expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['code'] })]));
  });

  it('modo partial no exige campos ausentes', () => {
    expect(validateClassroomFeatureCandidate({}, { partial: true })).toHaveLength(0);
  });
});
