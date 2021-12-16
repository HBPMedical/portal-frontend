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
    if (experiment) {
      const {
        results,
        name,
        viewed,
        shared,
        createdAt,
        finishedAt,
        status,
        id,
        ...selectedExperiment
      } = experiment;
      const merge = { ...draftExperimentVar(), ...selectedExperiment };
      draftExperimentVar(JSON.parse(JSON.stringify(merge)) as Experiment);
    }
    // simple deep copy (should be optimized if the copy method is slow)
  };
}
