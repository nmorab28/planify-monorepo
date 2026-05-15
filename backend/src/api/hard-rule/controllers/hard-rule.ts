import { createRuleController } from '../../shared/rule-controller';
import { validateHardRuleCandidate } from '../validation/hard-rule-validation';

export default createRuleController({
  uid: 'api::hard-rule.hard-rule',
  duplicateMessage: 'Ya existe una regla obligatoria con ese codigo.',
  duplicateCode: 'HARD_RULE_CODE_DUPLICATED',
  validate: validateHardRuleCandidate,
});
