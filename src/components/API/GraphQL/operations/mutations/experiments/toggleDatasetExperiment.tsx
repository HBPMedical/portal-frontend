import { ReactiveVar } from '@apollo/client';
import { Domain, Experiment, Group, Variable } from '../../../types.generated';

export default function createToggleDatasetExperiment(
  experiment: ReactiveVar<Experiment>,
  domain: ReactiveVar<Domain | undefined>,
  variablesVar: ReactiveVar<Variable[]>,
  groupsVar: ReactiveVar<Group[]>
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
      ...{
        datasets: newDatasets.map(d => d.id)
      }
    };

    // this filter get the list of allowed variables (filtered by datasets)
    const groups = domain()?.groups.filter(
      g =>
        g &&
        (!g?.datasets ||
          g.datasets.filter(d => newExperiment.datasets.includes(d)).length > 0)
    );

    const vars = groups
      ?.map(g => g.variables)
      .flat()
      .map(vId => domain()?.variables.find(v => v.id === vId))
      .map(v => v as Variable) // for typescript self esteem :)
      .filter(
        v =>
          v &&
          (!v?.datasets ||
            v.datasets.filter(d => newExperiment.datasets.includes(d)).length >
              0)
      );

    const varIds = vars?.map(v => v.id);

    if (varIds) {
      newExperiment.variables = newExperiment.variables.filter(v =>
        varIds.includes(v)
      );
      newExperiment.coVariables = newExperiment.coVariables?.filter(v =>
        varIds.includes(v)
      );
      newExperiment.filterVariables = newExperiment.filterVariables?.filter(v =>
        varIds.includes(v)
      );
    }

    groupsVar(groups);
    variablesVar(vars);

    experiment(newExperiment);
  };
}
