import { ReactiveVar } from '@apollo/client';
import { Domain } from '../../../types.generated';

export default function createSetDomains(domainsVar: ReactiveVar<Domain[]>) {
  /**
   * Populate the list of domains
   * @param domains array of domains
   */
  return (domains: Domain[]): void => {
    domainsVar(domains);
  };
}
