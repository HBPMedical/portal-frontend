import { Experiment } from '../../components/API/GraphQL/types.generated';
import { getMockDomain } from './mockDomainVar';

const mockDomain = getMockDomain();

export const mockExperiment: Experiment = {
  id: 'dummy-id',
  name: 'My Dummy Experiment',
  algorithm: {
    name: 'pca',
  },
  datasets: getMockDomain().datasets.map((d) => d.id),
  variables: [mockDomain.variables[0].id],
  coVariables: [mockDomain.variables[0].id, mockDomain.variables[1].id],
  filterVariables: [mockDomain.variables[2].id],
  domain: mockDomain.id,
  shared: false,
};
