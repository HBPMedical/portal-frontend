import { makeVar } from '@apollo/client';
import {
  getMockDomain,
  initMockDomainVar,
} from '../../../../../../tests/mocks/mockDomainVar';
import { mockExperiment } from '../../../../../../tests/mocks/mockExperiment';
import { Domain, Experiment, Group, Variable } from '../../../types.generated';
import createToggleDatasetExperiment from './toggleDatasetExperiment';

let mockDomain = getMockDomain();
const mockDraftExpVar = makeVar<Experiment>(mockExperiment);
const mockDomainVar = initMockDomainVar();
const mockDomainsVar = makeVar<Domain[]>([mockDomain]);
const mockGroups = makeVar<Group[]>(mockDomain.groups);
const mockVars = makeVar<Variable[]>(mockDomain.variables);
const mockAllowedVariableIdsVar = makeVar<string[]>([]);
const toggleDatasetExperiment = createToggleDatasetExperiment(
  mockDraftExpVar,
  mockDomainVar,
  mockDomainsVar,
  mockVars,
  mockGroups,
  mockAllowedVariableIdsVar
);

describe('Toggle datasets', () => {
  beforeEach(() => {
    mockDraftExpVar(mockExperiment);
    mockDomainVar(mockDomain);
    mockDomainsVar([mockDomain]);
    mockGroups(mockDomain.groups);
    mockVars(mockDomain.variables);
    mockDomain = getMockDomain();
    mockAllowedVariableIdsVar([]);
  });

  it('Test add and remove dataset to an experiment', () => {
    toggleDatasetExperiment(mockDomain.datasets[0].id);

    expect(mockDraftExpVar().datasets.length).toBe(1);
    expect(mockAllowedVariableIdsVar().length).toBeGreaterThan(0);

    toggleDatasetExperiment(mockDomain.datasets[0].id);

    expect(mockDraftExpVar().datasets.sort()).toEqual(
      mockDomain.datasets.map((d) => d.id).sort()
    );
  });

  it('Test no domain selected except error', () => {
    mockDomainVar(undefined);

    expect(() => toggleDatasetExperiment(mockDomain.datasets[0].id)).toThrow();
  });

  it('Test miss matching domain and selected domain', () => {
    mockDraftExpVar({ ...mockDraftExpVar(), domain: '' });

    expect(() => toggleDatasetExperiment(mockDomain.datasets[0].id)).toThrow();
  });

  it('Test add dataset filtered group', () => {
    mockDomain.groups[0].datasets = [mockDomain.datasets[0].id];
    mockDomain.datasetsVariables = {
      ...mockDomain.datasetsVariables,
      [mockDomain.datasets[0].id]: ['var2', 'var3', 'var6'],
      [mockDomain.datasets[1].id]: ['var2', 'var3', 'var5', 'var6'],
    };
    mockDomainVar(mockDomain);
    mockDomainsVar([mockDomain]);
    mockDraftExpVar({
      ...mockExperiment,
      datasets: mockDomain.datasets.filter((_, i) => i !== 0).map((d) => d.id),
    });

    mockGroups(mockGroups().filter((g) => g.id !== mockDomain.groups[0].id));
    toggleDatasetExperiment(mockDomain.datasets[0].id);

    expect(
      mockGroups()
        .map((g) => g.id)
        .sort()
    ).toEqual(mockDomain.groups.map((g) => g.id).sort());
  });

  it('Test remove dataset filtered group', () => {
    mockDomain.groups[0].datasets = [mockDomain.datasets[0].id];
    mockDomain.datasetsVariables = {
      ...mockDomain.datasetsVariables,
      [mockDomain.datasets[0].id]: ['var2', 'var3'],
      [mockDomain.datasets[1].id]: ['var2', 'var3', 'var5'],
    };
    mockDomainVar(mockDomain);
    mockDomainsVar([mockDomain]);

    const totalVars = mockDomain.groups
      .map((g) => g.variables?.length ?? 0)
      .reduce((p, v) => p + v, 0);

    toggleDatasetExperiment(mockDomain.datasets[0].id);

    expect(mockGroups().map((g) => g.id)).toStrictEqual(['group2']);

    const afterNbVars =
      totalVars -
      mockGroups()
        .map((g) => g.variables?.length ?? 0)
        .reduce((p, v) => p + v, 0);

    expect(afterNbVars).toBeGreaterThan(0);
  });

  it('Test add dataset filtered variables', () => {
    mockDomain.datasetsVariables = {
      ...mockDomain.datasetsVariables,
      [mockDomain.datasets[0].id]: mockDomain.datasetsVariables[
        mockDomain.datasets[0].id
      ].filter((id: string) => id !== mockDomain.variables[0].id),
    };
    mockDomainVar(mockDomain);
    mockDomainsVar([mockDomain]);
    const totalVars = mockDomain.variables.length;

    toggleDatasetExperiment(mockDomain.datasets[0].id);

    expect(
      mockVars()
        .map((v) => v.id)
        .sort()
    ).toEqual(
      mockDomain.variables
        .filter((_, i) => i !== 0)
        .map((v) => v.id)
        .sort()
    );

    const afterNbVars = totalVars - mockVars().length;
    expect(afterNbVars).toBeGreaterThan(0);
  });
});
