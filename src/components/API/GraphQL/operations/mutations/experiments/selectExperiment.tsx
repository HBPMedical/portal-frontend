import { ReactiveVar } from '@apollo/client';
import { Domain, Experiment } from '../../../types.generated';

export default function createSelectExperiment(
  selectedExperimentVar: ReactiveVar<Experiment | undefined>,
  draftExperimentVar: ReactiveVar<Experiment>,
  domainVar: ReactiveVar<Domain | undefined>,
  selectedDomain: (id: string) => void
) {
  /**
   * This function set the experiment as the currently selected experiment
   * and make a copy of the data for a new experiment
   * @param experiment
   */
  return (experiment?: Experiment): void => {
    if (!experiment) return;

    const domain = domainVar();
    if (experiment && domain && experiment?.domain !== domain.id)
      selectedDomain(experiment?.domain);

    selectedExperimentVar(experiment);

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

    // simple deep copy (should be optimized if the copy method is slow)
  };
}
