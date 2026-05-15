import { describe, expect, it } from 'vitest';

import { validateSoftRuleCandidate } from './soft-rule-validation';

describe('validateSoftRuleCandidate', () => {
  it('acepta una regla blanda valida', () => {
    const issues = validateSoftRuleCandidate({
      code: 'BALANCE_TEACHER_LOAD',
      name: 'Balancear carga docente',
      weight: 50,
      isEnabled: true,
      parameters: { maxDailyHours: 6 },
    });

    expect(issues).toHaveLength(0);
  });

  it('exige code, name y weight por defecto', () => {
    const issues = validateSoftRuleCandidate({});

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['code'] }),
        expect.objectContaining({ path: ['name'] }),
        expect.objectContaining({ path: ['weight'] }),
      ])
    );
  });

  it('permite actualizaciones parciales', () => {
    expect(validateSoftRuleCandidate({}, { partial: true })).toHaveLength(0);
    expect(validateSoftRuleCandidate({ weight: 80 }, { partial: true })).toHaveLength(0);
  });

  it('rechaza code con formato invalido', () => {
    const issues = validateSoftRuleCandidate({
      code: 'balance docente',
      name: 'Balance docente',
      weight: 50,
    });

    expect(issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['code'] })]));
  });

  it('rechaza weight fuera del rango permitido', () => {
    expect(
      validateSoftRuleCandidate({
        code: 'LOW_WEIGHT',
        name: 'Peso bajo',
        weight: 0,
      })
    ).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['weight'] })]));

    expect(
      validateSoftRuleCandidate({
        code: 'HIGH_WEIGHT',
        name: 'Peso alto',
        weight: 101,
      })
    ).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['weight'] })]));
  });

  it('valida isEnabled y parameters cuando vienen presentes', () => {
    const issues = validateSoftRuleCandidate({
      code: 'INVALID_OPTIONALS',
      name: 'Opcionales invalidos',
      weight: 20,
      isEnabled: 'yes',
      parameters: ['invalid'],
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['isEnabled'] }),
        expect.objectContaining({ path: ['parameters'] }),
      ])
    );
  });
});
