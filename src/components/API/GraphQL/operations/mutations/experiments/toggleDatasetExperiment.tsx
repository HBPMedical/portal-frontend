import { ReactiveVar } from '@apollo/client';
import { Domain, Experiment, Group, Variable } from '../../../types.generated';
import { buildDomainView } from './domainUtils';

export default function createToggleDatasetExperiment(
  experimentVar: ReactiveVar<Experiment>,
  domainVar: ReactiveVar<Domain | undefined>,
  domainsVar: ReactiveVar<Domain[]>,
  variablesVar: ReactiveVar<Variable[]>,
  groupsVar: ReactiveVar<Group[]>
) {
  /**
   * This function allow to toggle a dataset in an experiment
   * @param id id of the dataset
   */
  return (id: string): void => {
    const selectedDomain = domainVar();
    const experiment = experimentVar();
    if (!selectedDomain) throw new Error('No domain selected');

    if (experiment.domain !== selectedDomain.id)
      throw new Error(
        "Inconsistency between selected domain and experiment's domain"
      );

    const availableDomains = domainsVar();
    const baseDomain = availableDomains.find((d) => d.id === selectedDomain.id);
    if (!baseDomain) throw new Error('Domain definition not found');

    const dataset = baseDomain.datasets.find((d) => d.id === id);

    if (!dataset) throw new Error(`Domain ${id} not found`);

    const currentDatasets =
      baseDomain.datasets.filter((datasetItem) =>
        experiment.datasets.includes(datasetItem.id)
      ) ?? [];

    const newDatasets = currentDatasets.find((d) => d.id === dataset.id)
      ? currentDatasets.filter((d) => d.id !== dataset.id)
      : [...currentDatasets, dataset];

    const newExperiment = {
      ...experimentVar(),
      ...{
        datasets: newDatasets.map((d) => d.id),
      },
    };

    const { domain, groups, variables, allowedVariableIds } = buildDomainView(
      baseDomain,
      newExperiment.datasets
    );

    newExperiment.variables = newExperiment.variables.filter((variableId) =>
      allowedVariableIds.has(variableId)
    );
    newExperiment.coVariables = newExperiment.coVariables?.filter(
      (variableId) => allowedVariableIds.has(variableId)
    );
    newExperiment.filterVariables = newExperiment.filterVariables?.filter(
      (variableId) => allowedVariableIds.has(variableId)
    );

    domainVar(domain);
    groupsVar(groups);
    variablesVar(variables);

    experimentVar(newExperiment);
  };
}
