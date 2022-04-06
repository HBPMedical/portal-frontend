import { Experiment } from '../../components/API/GraphQL/types.generated';
import { mockDomain } from './mockDomainVar';

export const mockExperiment: Experiment = {
  id: 'dummy-id',
  name: 'My Dummy Experiment',
  algorithm: {
    id: 'pca'
  },
  datasets: mockDomain.datasets.map(d => d.id),
  variables: [mockDomain.variables[0].id],
  coVariables: [mockDomain.variables[0].id, mockDomain.variables[1].id],
  filterVariables: [mockDomain.variables[2].id],
  domain: mockDomain.id,
  shared: false
};
