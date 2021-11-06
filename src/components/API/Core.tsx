import { ApolloClient, InMemoryCache } from '@apollo/client';
import request from 'request-promise-native';
import { Container } from 'unstated';
import { backendURL } from '../API';
import { Exareme } from '../API/Exareme';
import { FORBIDDEN_ACCESS_MESSAGE } from '../constants';
import {
  Domain,
  Group,
  Variable as VariableData
} from './GraphQL/types.generated';
import { QUERY_DOMAINS } from './GraphQL/queries';
import { graphQLURL } from './RequestURLS';
import config from './RequestHeaders';

export interface Variable {
  code: string;
  label?: string;
}

export type types =
  | 'nominal'
  | 'ordinal'
  | 'real'
  | 'integer'
  | 'text'
  | 'date';

export interface VariableEntity extends Variable {
  type?: types;
  description?: string;
  enumerations?: Variable[];
  group?: Variable[];
  info?: string;
  isCategorical?: boolean;
}

interface Hierarchy {
  code: string;
  label: string;
  groups: VariableEntity[];
  variables: VariableEntity[];
}

export type AlgorithmType =
  | 'workflow'
  | 'pipeline'
  | 'python_iterative'
  | 'python_local_global'
  | 'multiple_local_global'
  | 'python_local';
export interface Algorithm {
  name: string;
  label: string;
  desc?: string;
  parameters: AlgorithmParameter[] | AlgorithmParameterRequest[];
  type: AlgorithmType;
  datasetType?: string;
  enabled?: boolean;
}

// FIXME should be private
export interface AlgorithmConstraintParameter {
  binominal?: boolean;
  integer?: boolean;
  polynominal?: boolean;
  real?: boolean;
  min_count?: number;
  max_count?: number;
}

export interface AlgorithmConstraint {
  variable: AlgorithmConstraintParameter;
  covariable: AlgorithmConstraintParameter;
  groupings: AlgorithmConstraintParameter;
  mixed: boolean;
}

export interface AlgorithmParameter {
  name: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  desc: string;
  type: string;
  columnValuesSQLType: string;
  columnValuesIsCategorical: string;
  columnValuesNumOfEnumerations: string;
  value: string;
  valueNotBlank: 'true' | 'false';
  valueMultiple: string;
  valueMin?: number | undefined;
  valueMax?: number | undefined;
  valueType: 'integer' | 'real' | 'json';
  visible?: boolean;
  valueEnumerations?: string[];
}

export interface AlgorithmParameterRequest {
  name: string;
  label: string;
  value: string;
}

export interface Stats {
  articles: number;
  users: number;
  variables: number;
}

export interface Article {
  abstract?: string;
  content?: string;
  slug: string;
  status?: string;
  title?: string;
}

export interface GalaxyConfig {
  authorization?: string;
  context?: string;
  error?: { error?: string; message: string };
}

interface PathologiesVariables {
  [key: string]: VariableEntity[];
}

interface PathologiesHierarchies {
  [key: string]: Hierarchy;
}

interface Dictionary<T> {
  [Key: string]: T;
}

export interface State {
  error?: string;
  loading?: boolean;
  algorithms?: Algorithm[];
  pathologies?: VariableEntity[];
  pathologyError?: string;
  article?: Article;
  articles?: Article[];
  stats?: Stats;
  galaxy?: GalaxyConfig;
  pathologiesVariables: PathologiesVariables;
  pathologiesDatasets: PathologiesVariables;
  pathologiesHierarchies: PathologiesHierarchies;
}

export const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GATEWAY_URL,
  headers: {
    ...config.options?.headers,
    accept: 'application/json, text/plain, */*'
  },
  cache: new InMemoryCache({
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
  })
});

class Core extends Container<State> {
  state: State = {
    pathologiesVariables: {},
    pathologiesDatasets: {},
    pathologiesHierarchies: {}
  };

  private options: request.Options;
  private backendURL: string;

  constructor(config: Record<string, any>) {
    super();
    this.options = config.options;
    this.backendURL = backendURL;
  }

  // TODO: those infos should be reconciliated in the model when the fetch occurs
  // At the moment, the model is storing only variable codes
  lookup = (
    code: string,
    pathologyCode: string | undefined
  ): VariableEntity => {
    if (!pathologyCode) {
      return { code, label: code, info: code };
    }

    const variablesForPathology = this.state.pathologiesVariables;

    if (!variablesForPathology) {
      return { code, label: code, info: code };
    }

    const variables = variablesForPathology[pathologyCode];
    if (variables) {
      const originalVar =
        variables &&
        variables.find((variable: VariableEntity) => variable.code === code);

      if (originalVar) {
        const info = `${originalVar.label} (${originalVar.type})`;
        return { ...originalVar, info };
      } else {
        return { code, label: code, info: code };
      }
    }

    return { code, label: code, info: code };
  };

  fetchPathologies = async (): Promise<void> => {
    try {
      const query = await apolloClient.query({ query: QUERY_DOMAINS });
      const domains: Domain[] = query.data.domains;

      const pathologies: Variable[] = domains.map(domain => ({
        code: domain.id,
        label: domain.label ?? ''
      }));

      if (pathologies && pathologies.length === 0) {
        return await this.setState({
          pathologyError: FORBIDDEN_ACCESS_MESSAGE
        });
      }

      const pathologiesVariables: PathologiesVariables = {};
      const pathologiesDatasets: PathologiesVariables = {};
      const pathologiesHierarchies: PathologiesHierarchies = {};

      // Variable interface should be seen as an Entity interface

      domains.forEach(domain => {
        const vars: VariableEntity[] = domain.variables.map(
          this.dataToVariable
        );

        const datasets = domain.datasets.map(
          (dataset): Variable => {
            return {
              code: dataset.id,
              label: dataset.label ?? ''
            };
          }
        );

        const lookupGroups: Dictionary<Group> = {};

        domain.groups.forEach(group => {
          if (!lookupGroups[group.id]) {
            lookupGroups[group.id] = group;
          }
        });

        const groups: Hierarchy = this.dataToHierarchy(
          domain.rootGroup,
          vars,
          lookupGroups
        );

        pathologiesVariables[domain.id] = vars;
        pathologiesDatasets[domain.id] = datasets;
        pathologiesHierarchies[domain.id] = groups;
      });

      return await this.setState({
        error: undefined,
        pathologies,
        pathologiesVariables,
        pathologiesDatasets,
        pathologiesHierarchies
      });
    } catch (error) {
      return await this.setState({
        pathologyError: FORBIDDEN_ACCESS_MESSAGE
      });
    }
  };

  private dataToVariable = (variable: VariableData): VariableEntity => {
    const enums = variable.enumerations
      ? variable.enumerations.map(cat => {
          return {
            code: cat.id,
            label: cat.label ?? ''
          };
        })
      : [];

    return {
      code: variable.id,
      label: variable.label ?? '',
      description: variable.description ?? '',
      isCategorical: enums.length !== 0,
      enumerations: enums,
      type: (variable.type as types) ?? undefined
    };
  };

  private dataToHierarchy = (
    group: Group,
    lookupVars: VariableEntity[],
    lookupGroup: Dictionary<Group>
  ): Hierarchy => {
    return {
      code: group.id,
      label: group.label ?? '',
      variables: group.variables
        ? (group.variables
            .map(variable => lookupVars.find(item => item.code === variable))
            .filter(item => !!item) as VariableEntity[])
        : [], //can be optimize (time complexity over memory complexity) by doing a lookup table
      groups: group.groups
        ? group.groups.map(it =>
            this.dataToHierarchy(lookupGroup[it], lookupVars, lookupGroup)
          )
        : []
    };
  };

  algorithms = async (all = false): Promise<void> => {
    const exaremeAlgorithms = await this.fetchAlgorithms(all);
    this.setState(state => ({
      ...state,
      algorithms: [
        ...(state.algorithms || []),
        ...((exaremeAlgorithms && exaremeAlgorithms.data) || [])
      ],
      error: undefined
    }));

    return Promise.resolve();
  };

  fetchGalaxyConfiguration = async (): Promise<void> => {
    try {
      const data = await request.get(`${this.backendURL}/galaxy`, {
        ...this.options
      });
      const json = await JSON.parse(data);

      return await this.setState({
        galaxy: json
      });
    } catch (e) {
      // FIXME: Need to change the request library, not handling error status code
      try {
        return await this.setState({
          galaxy: { error: JSON.parse(e.error) }
        });
      } catch (e) {
        return await this.setState({
          galaxy: { error: { message: 'Unknow error' } }
        });
      }
    }
  };

  private defaultValueFor = ({
    label,
    defaults = {
      alpha: 0.1,
      kfold: 3,
      testSize: 0.2
    }
  }: {
    label: string;
    defaults?: any;
  }): string => {
    return defaults[label] ? defaults[label] : '';
  };

  private fetchAlgorithms = async (
    all = false
  ): Promise<{
    error: string | undefined;
    data: Algorithm[] | undefined;
  }> => {
    try {
      const response = await request.get(
        `${this.backendURL}/algorithms`,
        this.options
      );
      const json = await JSON.parse(response);

      if (json.error) {
        return { error: json.error, data: undefined };
      }

      const algorithms = Exareme.algorithmOutputFiltering(json);
      const data = algorithms.sort((x: Algorithm, y: Algorithm) => {
        const a = x.label;
        const b = y.label;

        return a > b ? 1 : a < b ? -1 : 0;
      });

      return { error: undefined, data };
    } catch (error) {
      console.log(error);
      return { error, data: undefined };
    }
  };
}

export default Core;
