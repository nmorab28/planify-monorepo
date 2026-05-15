import { createRuleController } from '../../shared/rule-controller';
import { validateSoftRuleCandidate } from '../validation/soft-rule-validation';

export default createRuleController({
  uid: 'api::soft-rule.soft-rule',
  duplicateMessage: 'Ya existe una regla blanda con ese codigo.',
  duplicateCode: 'SOFT_RULE_CODE_DUPLICATED',
  validate: validateSoftRuleCandidate,
});
