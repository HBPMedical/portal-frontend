import { ReactiveVar } from '@apollo/client';
import { Domain, Experiment } from '../../../types.generated';

export default function createToggleDatasetExperiment(
  experiment: ReactiveVar<Experiment>,
  domain: ReactiveVar<Domain | undefined>
) {
  /**
   * This function allow to toggle a dataset in an experiment
   * @param id id of the dataset
   */
  return (id: string): void => {
    if (!domain()) throw new Error('No domain selected');

    if (experiment().domain !== domain()?.id)
      throw new Error(
        "Inconsistency between selected domain and experiment's domain"
      );

    const dataset = domain()?.datasets.find(d => d.id === id);

    if (!dataset) throw new Error(`Domain ${id} not found`);

    const datasets =
      domain()?.datasets.filter(d => experiment().datasets.includes(d.id)) ??
      [];

    let newDatasets = datasets.find(d => d.id === dataset.id)
      ? datasets.filter(d => d.id !== dataset.id)
      : [...datasets, dataset];

    newDatasets = dataset.isLongitudinal
      ? newDatasets.filter(d => d.isLongitudinal)
      : newDatasets.filter(d => !d.isLongitudinal);

    const newExperiment = {
      ...experiment(),
      ...{ datasets: newDatasets.map(d => d.id) }
    };

    experiment(newExperiment);
  };
}
