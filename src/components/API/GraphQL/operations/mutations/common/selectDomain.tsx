import { ReactiveVar } from '@apollo/client';
import { Domain } from '../../../types.generated';

export default function createSelectDomain(
  selectDomainVar: ReactiveVar<Domain | undefined>,
  domainsVar: ReactiveVar<Domain[]>
) {
  /**
   * Select the domain
   * @param id id of the domain
   */
  return (id: string | undefined): void => {
    selectDomainVar(domainsVar().find(d => d.id === id));
  };
}
