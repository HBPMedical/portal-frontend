import { ReactiveVar } from '@apollo/client';
import { Domain, Experiment, Group, Variable } from '../../../types.generated';

export default function createResetStore(
  zoomNodeVar: ReactiveVar<string | undefined>,
  domainsVar: ReactiveVar<Domain[]>,
  selectedDomainVar: ReactiveVar<Domain | undefined>,
  selectedVariableVar: ReactiveVar<string | undefined>,
  selectedExperimentVar: ReactiveVar<Experiment | undefined>,
  draftExperimentVar: ReactiveVar<Experiment>,
  variablesVar: ReactiveVar<Variable[]>,
  groupsVar: ReactiveVar<Group[]>,
  allowedVariableIdsVar: ReactiveVar<string[]>,
  showUnavailableVariablesVar: ReactiveVar<boolean>
) {
  /**
   * This function reset reactive variables
   *
   * /!\ User reactive variables will not be changed /!\
   */
  return (): void => {
    zoomNodeVar(undefined);
    domainsVar([]);
    selectedDomainVar(undefined);
    selectedVariableVar(undefined);
    selectedExperimentVar(undefined);
    draftExperimentVar(undefined);
    variablesVar([]);
    groupsVar([]);
    allowedVariableIdsVar([]);
    showUnavailableVariablesVar(true);
  };
}
