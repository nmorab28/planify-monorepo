import { describe, expect, it } from 'vitest';

import { validateHardRuleCandidate } from './hard-rule-validation';

describe('validateHardRuleCandidate', () => {
  it('accepts a valid hard rule', () => {
    expect(
      validateHardRuleCandidate({
        code: 'NO_OVERLAP',
        name: 'Sin traslapes de horario',
        isEnabled: true,
        parameters: { scope: 'teacher' },
      })
    ).toEqual([]);
  });

  it('requires code and name for create', () => {
    expect(validateHardRuleCandidate({})).toEqual([
      { path: ['code'], message: 'El codigo de la regla es obligatorio.' },
      { path: ['name'], message: 'El nombre de la regla es obligatorio.' },
    ]);
  });

  it('allows partial updates', () => {
    expect(validateHardRuleCandidate({ isEnabled: false }, { partial: true })).toEqual([]);
  });

  it('validates code format', () => {
    expect(validateHardRuleCandidate({ code: 'no overlap', name: 'Regla' })).toContainEqual({
      path: ['code'],
      message:
        'El codigo debe tener entre 2 y 80 caracteres y solo usar mayusculas, numeros, guion o guion bajo.',
    });
  });

  it('rejects invalid JSON parameter shape', () => {
    expect(
      validateHardRuleCandidate({
        code: 'NO_OVERLAP',
        name: 'Sin traslapes',
        parameters: ['teacher'],
      })
    ).toContainEqual({
      path: ['parameters'],
      message: 'parameters debe ser un objeto JSON.',
    });
  });
});
