import { InMemoryCache, makeVar } from '@apollo/client';
import { Experiment } from './types.generated';

export const cache: InMemoryCache = new InMemoryCache({
  possibleTypes: {
    // https://github.com/apollographql/apollo-client/issues/7050
    ResultUnion: [
      'RawResult',
      'GroupsResult',
      'TableResult',
      'HeatMapResult',
      'LineChartResult'
    ]
  }
});

export const initialExperiment: Experiment = {
  id: '',
  algorithm: {
    id: '',
    parameters: []
  },
  datasets: [],
  domain: '',
  name: 'New experiment',
  shared: false,
  viewed: false,
  variables: []
};

export const selectedExperimentVar = makeVar<Experiment | undefined>(undefined);

export const draftExperimentVar = makeVar<Experiment>(initialExperiment);
