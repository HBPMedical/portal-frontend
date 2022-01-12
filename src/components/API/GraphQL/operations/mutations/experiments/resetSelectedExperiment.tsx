import { ReactiveVar } from '@apollo/client';
import { initialExperiment } from '../../../cache';
import { Experiment } from '../../../types.generated';

export default function createResetSelectedExperiment(
  selectedExperimentVar: ReactiveVar<Experiment | undefined>,
  draftExperimentVar: ReactiveVar<Experiment>
) {
  /**
   * This function reset the selected experiment and
   * reset the current draft experiment
   */
  return (): void => {
    selectedExperimentVar(undefined);
    draftExperimentVar(initialExperiment);
  };
}
