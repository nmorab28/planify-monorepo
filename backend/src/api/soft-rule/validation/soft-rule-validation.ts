import type {
  RuleCandidate,
  ValidationIssue,
  ValidationOptions,
} from '../../shared/rule-validation';
import { isPresent, toIntegerOrNaN, validateRuleBase } from '../../shared/rule-validation';

export type SoftRuleCandidate = {
  code?: RuleCandidate['code'];
  name?: RuleCandidate['name'];
  weight?: unknown;
  isEnabled?: RuleCandidate['isEnabled'];
  parameters?: RuleCandidate['parameters'];
};

const MIN_WEIGHT = 1;
const MAX_WEIGHT = 100;

export function validateSoftRuleCandidate(
  input: SoftRuleCandidate,
  opts: ValidationOptions = {}
): ValidationIssue[] {
  const issues = validateRuleBase(input, opts);

  if (!isPresent(input.weight)) {
    if (!opts.partial) {
      issues.push({ path: ['weight'], message: 'El peso es obligatorio.' });
    }
  } else {
    const weight = toIntegerOrNaN(input.weight);

    if (Number.isNaN(weight)) {
      issues.push({ path: ['weight'], message: 'El peso debe ser un numero entero.' });
    } else if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
      issues.push({
        path: ['weight'],
        message: `El peso debe estar entre ${MIN_WEIGHT} y ${MAX_WEIGHT}.`,
      });
    }
  }

  return issues;
}
