import { ReactiveVar } from '@apollo/client';
import { selectedDomainVar } from '../../../cache';
import { Domain, Experiment } from '../../../types.generated';

export default function createSelectDomain(
  selectDomainVar: ReactiveVar<Domain | undefined>,
  domainsVar: ReactiveVar<Domain[]>,
  experimentVar: ReactiveVar<Experiment>
) {
  /**
   * Select the domain and set default dataset for the experiment
   * @param id id of the domain
   */
  return (id: string | undefined): void => {
    selectDomainVar(domainsVar().find(d => d.id === id));
    experimentVar({
      ...experimentVar(),
      ...{
        datasets:
          selectedDomainVar()
            ?.datasets.filter(d => !d.isLongitudinal)
            .map(d => d.id) ?? []
      }
    });
  };
}
