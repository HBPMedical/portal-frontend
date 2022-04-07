import { makeVar } from '@apollo/client';
import { getMockDomain } from '../../../../../../tests/mocks/mockDomainVar';
import { Domain } from '../../../types.generated';
import createSetDomains from './setDomains';

const mockDomain = getMockDomain();
const mockDomainsVar = makeVar<Domain[]>([]);
const setDomains = createSetDomains(mockDomainsVar);

describe('Set domains', () => {
  it('Test settings domains', () => {
    const domains = [mockDomain, mockDomain];
    setDomains(domains);
    expect(mockDomainsVar()).toBe(domains);
  });
});
