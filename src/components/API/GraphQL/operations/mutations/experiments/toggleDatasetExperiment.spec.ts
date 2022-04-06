import { makeVar } from '@apollo/client';
import {
  initMockDomainVar,
  mockDomain
} from '../../../../../../tests/mocks/mockDomainVar';
import { mockExperiment } from '../../../../../../tests/mocks/mockExperiment';
import { Experiment, Group, Variable } from '../../../types.generated';
import createToggleDatasetExperiment from './toggleDatasetExperiment';

const mockDraftExpVar = makeVar<Experiment>(mockExperiment);
const mockDomainVar = initMockDomainVar();
const mockGroups = makeVar<Group[]>(mockDomain.groups);
const mockVars = makeVar<Variable[]>(mockDomain.variables);
const toggleDatasetExperiment = createToggleDatasetExperiment(
  mockDraftExpVar,
  mockDomainVar,
  mockVars,
  mockGroups
);

describe('Toggle datasets', () => {
  beforeEach(() => {
    mockDraftExpVar(mockExperiment);
    mockDomainVar(mockDomain);
    mockGroups(mockDomain.groups);
    mockVars(mockDomain.variables);
  });

  it('Test add and remove dataset to an experiment', () => {
    toggleDatasetExperiment(mockDomain.datasets[0].id);

    expect(mockDraftExpVar().datasets.length).toBe(1);

    toggleDatasetExperiment(mockDomain.datasets[0].id);

    expect(mockDraftExpVar().datasets.sort()).toEqual(
      mockDomain.datasets.map(d => d.id).sort()
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

  test.todo('Test add dataset filtered group');

  test.todo('Test add dataset filtered variables');
});
