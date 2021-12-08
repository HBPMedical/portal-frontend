import { ReactiveVar } from '@apollo/client';
import { Experiment } from '../../../types.generated';

export default function createSelectExperiment(
  selectedExperimentVar: ReactiveVar<Experiment | undefined>,
  draftExperimentVar: ReactiveVar<Experiment>
) {
  /**
   * This function set the experiment as the currently selected experiment
   * and make a copy of the data for a new experiment
   * @param experiment
   */
  return (experiment?: Experiment): void => {
    selectedExperimentVar(experiment);
    if (experiment)
      draftExperimentVar(
        JSON.parse(JSON.stringify(selectedExperimentVar())) as Experiment
      ); // simple deep copy (should be optimized if the copy method is slow)
  };
}
