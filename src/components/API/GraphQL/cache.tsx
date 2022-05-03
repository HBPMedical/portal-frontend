import { InMemoryCache, makeVar } from '@apollo/client';
import { SessionState } from '../../../utilities/types';
import {
  Configuration,
  Domain,
  Experiment,
  Group,
  Variable
} from './types.generated';

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
export const selectedVariableVar = makeVar<string | undefined>(undefined);
export const selectedDomainVar = makeVar<Domain | undefined>(undefined);
export const selectedExperimentVar = makeVar<Experiment | undefined>(undefined);
export const draftExperimentVar = makeVar<Experiment>(initialExperiment);
export const variablesVar = makeVar<Variable[]>([]);
export const groupsVar = makeVar<Group[]>([]);

export const cacheConfig = {
  possibleTypes: {
    // https://github.com/apollographql/apollo-client/issues/7050
    ResultUnion: [
      'RawResult',
      'GroupsResult',
      'TableResult',
      'HeatMapResult',
      'LineChartResult'
    ],
    BaseParameter: ['StringParameter', 'NominalParameter', 'NumberParameter']
  },
  typePolicies: {
    Query: {
      fields: {
        configuration: {
          merge(existing = {}, incoming: any) {
            return { ...existing, ...incoming };
          }
        }
      }
    }
  }
};

export const cache: InMemoryCache = new InMemoryCache(cacheConfig);
