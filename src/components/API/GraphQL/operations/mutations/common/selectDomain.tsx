import { ReactiveVar } from '@apollo/client';
import { initialExperiment } from '../../../cache';
import { Domain, Experiment } from '../../../types.generated';

export default function createSelectDomain(
  selectedDomainVar: ReactiveVar<Domain | undefined>,
  domainsVar: ReactiveVar<Domain[]>,
  experimentVar: ReactiveVar<Experiment>
) {
  /**
   * Select the domain and set default dataset for the experiment
   * @param id id of the domain
   */
  return (id: string): void => {
    if (selectedDomainVar() && selectedDomainVar()?.id === id) return; // the domain is already selected

    const domain = domainsVar().find(d => d.id === id);
    if (!domain) throw new Error('The selected domain cannot be found !');

    selectedDomainVar(domain);
    experimentVar({
      ...initialExperiment,
      ...{
        domain: domain.id,
        datasets:
          domain.datasets.filter(d => !d.isLongitudinal).map(d => d.id) ?? []
      }
    });
  };
}
