import type { RuleCandidate, ValidationIssue, ValidationOptions } from '../../shared/rule-validation';
import { validateRuleBase } from '../../shared/rule-validation';

export type HardRuleCandidate = RuleCandidate;

export function validateHardRuleCandidate(
  input: HardRuleCandidate,
  opts: ValidationOptions = {}
): ValidationIssue[] {
  return validateRuleBase(input, opts);
}
