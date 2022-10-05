import { ReactiveVar } from '@apollo/client';
import { initialExperiment } from '../../../cache';
import { Domain, Experiment } from '../../../types.generated';

export default function createResetSelectedExperiment(
  selectedExperimentVar: ReactiveVar<Experiment | undefined>,
  draftExperimentVar: ReactiveVar<Experiment>,
  domainVar: ReactiveVar<Domain | undefined>
) {
  /**
   * This function reset the selected experiment and
   * reset the current draft experiment
   */
  return (): void => {
    const domain = domainVar()?.id ?? '';
    const datasets =
      domainVar()
        ?.datasets.filter((d) => !d.isLongitudinal)
        .map((d) => d.id) ?? [];
    selectedExperimentVar(undefined);
    draftExperimentVar({ ...initialExperiment, domain, datasets });
  };
}
