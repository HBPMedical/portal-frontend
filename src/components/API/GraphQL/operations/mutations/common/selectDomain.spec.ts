import { makeVar } from '@apollo/client';
import { getMockDomain } from '../../../../../../tests/mocks/mockDomainVar';
import { initialExperiment } from '../../../cache';
import { Domain, Experiment, Group, Variable } from '../../../types.generated';
import createSelectDomain from './selectDomain';

const mockDomain = getMockDomain();
const mockDomainsVar = makeVar<Domain[]>([mockDomain]);
const mockDraftExpVar = makeVar<Experiment>(initialExperiment);
const mockDomainVar = makeVar<Domain | undefined>(undefined);
const mockGroups = makeVar<Group[]>(mockDomain.groups);
const mockVars = makeVar<Variable[]>(mockDomain.variables);
const mockAllowedVariableIdsVar = makeVar<string[]>([]);
const selectDomain = createSelectDomain(
  mockDomainVar,
  mockDomainsVar,
  mockDraftExpVar,
  mockVars,
  mockGroups,
  mockAllowedVariableIdsVar
);

describe('Select domain', () => {
  it('Test selecting a domain', () => {
    selectDomain(mockDomain.id);
    expect(mockDraftExpVar().domain).toBe(mockDomain.id);
    expect(mockAllowedVariableIdsVar().length).toBeGreaterThan(0);
  });
});
