import { ReactiveVar } from '@apollo/client';
import { Domain, Experiment, Group, Variable } from '../../../types.generated';

function extractGroups(g: Group, groups: Group[], datasets: string[]): Group[] {
  const extracted: Group[] = [];
  if (
    g?.datasets &&
    g.datasets.filter((d) => datasets.includes(d)).length === 0
  )
    return extracted;

  extracted.push(g);

  g.groups
    ?.map((childId) => groups.find((grp) => grp.id === childId))
    .filter((item) => item)
    .map((item) => item as Group)
    .map((child) => extractGroups(child, groups, datasets))
    .forEach((childs) => extracted.push(...childs));

  return extracted;
}

export default function createToggleDatasetExperiment(
  experimentVar: ReactiveVar<Experiment>,
  domainVar: ReactiveVar<Domain | undefined>,
  variablesVar: ReactiveVar<Variable[]>,
  groupsVar: ReactiveVar<Group[]>
) {
  /**
   * This function allow to toggle a dataset in an experiment
   * @param id id of the dataset
   */
  return (id: string): void => {
    const domain = domainVar();
    const experiment = experimentVar();
    if (!domain) throw new Error('No domain selected');

    if (experiment.domain !== domain.id)
      throw new Error(
        "Inconsistency between selected domain and experiment's domain"
      );

    const dataset = domain.datasets.find((d) => d.id === id);

    if (!dataset) throw new Error(`Domain ${id} not found`);

    const datasets =
      domain.datasets.filter((d) => experiment.datasets.includes(d.id)) ?? [];

    let newDatasets = datasets.find((d) => d.id === dataset.id)
      ? datasets.filter((d) => d.id !== dataset.id)
      : [...datasets, dataset];

    newDatasets = dataset.isLongitudinal
      ? newDatasets.filter((d) => d.isLongitudinal)
      : newDatasets.filter((d) => !d.isLongitudinal);

    const newExperiment = {
      ...experimentVar(),
      ...{
        datasets: newDatasets.map((d) => d.id),
      },
    };

    // this filter get the list of allowed variables (filtered by datasets)
    const groups = extractGroups(
      domain.rootGroup,
      domain.groups,
      newExperiment.datasets
    ).filter((g) => g !== domain.rootGroup);

    const vars = groups
      ?.map((g) => g.variables)
      .flat()
      .map((vId) => domain.variables.find((v) => v.id === vId))
      .map((v) => v as Variable) // for typescript self esteem :)
      .filter(
        (v) =>
          v &&
          (!v?.datasets ||
            v.datasets.filter((d) => newExperiment.datasets.includes(d))
              .length > 0)
      )
      .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);

    const varIds = vars?.map((v) => v.id);

    if (varIds) {
      newExperiment.variables = newExperiment.variables.filter((v) =>
        varIds.includes(v)
      );
      newExperiment.coVariables = newExperiment.coVariables?.filter((v) =>
        varIds.includes(v)
      );
      newExperiment.filterVariables = newExperiment.filterVariables?.filter(
        (v) => varIds.includes(v)
      );
    }

    groupsVar(groups);
    variablesVar(vars);

    experimentVar(newExperiment);
  };
}
