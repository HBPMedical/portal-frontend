import { ReactiveVar } from '@apollo/client';
import { initialExperiment } from '../../../cache';
import { Domain, Experiment, Group, Variable } from '../../../types.generated';
import { buildDomainView } from '../experiments/domainUtils';

export default function createSelectDomain(
  selectedDomainVar: ReactiveVar<Domain | undefined>,
  domainsVar: ReactiveVar<Domain[]>,
  experimentVar: ReactiveVar<Experiment>,
  variablesVar: ReactiveVar<Variable[]>,
  groupsVar: ReactiveVar<Group[]>
) {
  /**
   * Select the domain and set default dataset for the experiment
   * @param id id of the domain
   */
  return (id: string): void => {
    if (selectedDomainVar() && selectedDomainVar()?.id === id) return; // the domain is already selected

    const domain = domainsVar().find((d) => d.id === id);
    if (!domain) throw new Error('The selected domain cannot be found !');

    const defaultDatasets = domain.datasets.map((dataset) => dataset.id);

    const {
      domain: filteredDomain,
      groups,
      variables,
    } = buildDomainView(domain, defaultDatasets);

    selectedDomainVar(filteredDomain);
    experimentVar({
      ...initialExperiment,
      ...{
        domain: domain.id,
        datasets: defaultDatasets,
      },
    });
    variablesVar(variables);
    groupsVar(groups);
  };
}
