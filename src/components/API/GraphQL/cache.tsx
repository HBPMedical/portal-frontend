import { InMemoryCache, makeVar } from '@apollo/client';
import { SessionState } from '../../../utilities/types';
import { Configuration, Domain, Experiment, User } from './types.generated';

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

export const initialUser = {
  id: '',
  username: 'anonymous'
};

export const initialConfig: Configuration = {
  connectorId: 'default',
  hasGalaxy: false,
  version: ''
};

export const sessionStateVar = makeVar<SessionState>(SessionState.INIT);
export const configurationVar = makeVar<Configuration>(initialConfig);
export const zoomNodeVar = makeVar<string | undefined>(undefined);
export const domainsVar = makeVar<Domain[]>([]);
export const currentUserVar = makeVar<User | undefined>(undefined);
export const selectedVariableVar = makeVar<string | undefined>(undefined);
export const selectedDomainVar = makeVar<Domain | undefined>(undefined);
export const selectedExperimentVar = makeVar<Experiment | undefined>(undefined);
export const draftExperimentVar = makeVar<Experiment>(initialExperiment);
export const userVar = makeVar<typeof initialUser>(initialUser);

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
  },
  typePolicies: {
    // see https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/
    // should be calculated in the gateway this is temporary as there is no session in the gateway at the moment
    Experiment: {
      fields: {
        isOwner: {
          read(_, { readField }): boolean {
            const author = readField<Experiment['author']>('createdBy');
            return userVar().username === author?.username;
          }
        }
      }
    }
  }
});
