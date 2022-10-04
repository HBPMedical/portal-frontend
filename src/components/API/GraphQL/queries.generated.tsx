import * as Types from './types.generated';

import { gql } from '@apollo/client';
import { CoreInfoResultFragmentDoc } from './fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetConfigurationQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetConfigurationQuery = { __typename?: 'Query', configuration: { __typename?: 'Configuration', connectorId: string, hasGalaxy?: Types.Maybe<boolean>, hasGrouping?: Types.Maybe<boolean>, hasFilters?: Types.Maybe<boolean>, enableSSO?: Types.Maybe<boolean>, skipAuth?: Types.Maybe<boolean>, skipTos?: Types.Maybe<boolean>, version: string } };

export type ListAlgorithmsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListAlgorithmsQuery = { __typename?: 'Query', algorithms: Array<{ __typename?: 'Algorithm', id: string, label?: Types.Maybe<string>, type?: Types.Maybe<string>, description?: Types.Maybe<string>, hasFormula?: Types.Maybe<boolean>, variable: { __typename?: 'VariableParameter', hint?: Types.Maybe<string>, isRequired?: Types.Maybe<boolean>, hasMultiple?: Types.Maybe<boolean>, allowedTypes?: Types.Maybe<Array<string>> }, coVariable?: Types.Maybe<{ __typename?: 'VariableParameter', hint?: Types.Maybe<string>, isRequired?: Types.Maybe<boolean>, hasMultiple?: Types.Maybe<boolean>, allowedTypes?: Types.Maybe<Array<string>> }>, parameters?: Types.Maybe<Array<{ __typename: 'NominalParameter', linkedTo?: Types.Maybe<Types.AllowedLink>, name: string, label?: Types.Maybe<string>, hint?: Types.Maybe<string>, isRequired?: Types.Maybe<boolean>, hasMultiple?: Types.Maybe<boolean>, defaultValue?: Types.Maybe<string>, allowedValues?: Types.Maybe<Array<{ __typename?: 'OptionValue', value: string, label: string }>> } | { __typename: 'NumberParameter', min?: Types.Maybe<number>, max?: Types.Maybe<number>, isReal?: Types.Maybe<boolean>, name: string, label?: Types.Maybe<string>, hint?: Types.Maybe<string>, isRequired?: Types.Maybe<boolean>, hasMultiple?: Types.Maybe<boolean>, defaultValue?: Types.Maybe<string> } | { __typename: 'StringParameter', name: string, label?: Types.Maybe<string>, hint?: Types.Maybe<string>, isRequired?: Types.Maybe<boolean>, hasMultiple?: Types.Maybe<boolean>, defaultValue?: Types.Maybe<string> }>> }> };

export type VarBodyFragment = { __typename?: 'VariableParameter', hint?: Types.Maybe<string>, isRequired?: Types.Maybe<boolean>, hasMultiple?: Types.Maybe<boolean>, allowedTypes?: Types.Maybe<Array<string>> };

export type GetFilterFormulaDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetFilterFormulaDataQuery = { __typename?: 'Query', algorithms: Array<{ __typename?: 'Algorithm', id: string, label?: Types.Maybe<string>, hasFormula?: Types.Maybe<boolean> }>, filter: { __typename?: 'FilterConfiguration', numberTypes?: Types.Maybe<Array<string>> }, formula: Array<{ __typename?: 'FormulaOperation', variableType: string, operationTypes: Array<string> }> };

export type GetVariablesFromDomainQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetVariablesFromDomainQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', variables: Array<{ __typename?: 'Variable', id: string, label?: Types.Maybe<string>, type?: Types.Maybe<string> }> }> };

export type ActiveUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ActiveUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, username: string, fullname?: Types.Maybe<string>, email?: Types.Maybe<string>, agreeNDA?: Types.Maybe<boolean> } };

export type GetDomainListQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDomainListQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', id: string, label?: Types.Maybe<string>, datasets: Array<{ __typename?: 'Dataset', id: string, label?: Types.Maybe<string>, isLongitudinal?: Types.Maybe<boolean> }> }> };

export type GetExperimentListQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
  page?: Types.Maybe<Types.Scalars['Float']>;
}>;


export type GetExperimentListQuery = { __typename?: 'Query', experimentList: { __typename?: 'ListExperiments', totalPages?: Types.Maybe<number>, currentPage?: Types.Maybe<number>, totalExperiments?: Types.Maybe<number>, experiments?: Types.Maybe<Array<{ __typename?: 'Experiment', id: string, name: string, createdAt?: Types.Maybe<string>, viewed?: Types.Maybe<boolean>, shared: boolean, status?: Types.Maybe<Types.ExperimentStatus>, author?: Types.Maybe<{ __typename?: 'Author', username?: Types.Maybe<string>, fullname?: Types.Maybe<string> }> }>> } };

export type GetExperimentQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetExperimentQuery = { __typename?: 'Query', experiment: { __typename?: 'Experiment', name: string, id: string, domain: string, datasets: Array<string>, filter?: Types.Maybe<string>, createdAt?: Types.Maybe<string>, finishedAt?: Types.Maybe<string>, viewed?: Types.Maybe<boolean>, variables: Array<string>, coVariables?: Types.Maybe<Array<string>>, filterVariables?: Types.Maybe<Array<string>>, shared: boolean, status?: Types.Maybe<Types.ExperimentStatus>, author?: Types.Maybe<{ __typename?: 'Author', username?: Types.Maybe<string>, fullname?: Types.Maybe<string> }>, formula?: Types.Maybe<{ __typename?: 'Formula', interactions?: Types.Maybe<Array<Array<string>>>, transformations?: Types.Maybe<Array<{ __typename?: 'Transformation', id: string, operation: string }>> }>, algorithm: { __typename?: 'AlgorithmResult', name: string, parameters?: Types.Maybe<Array<{ __typename?: 'ParamValue', name: string, value: string }>> }, results?: Types.Maybe<Array<{ __typename?: 'AlertResult', title?: Types.Maybe<string>, message: string, level?: Types.Maybe<Types.AlertLevel> } | { __typename?: 'BarChartResult', name: string, barValues: Array<number>, hasConnectedBars?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }> } | { __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'AlertResult', title?: Types.Maybe<string>, message: string, level?: Types.Maybe<Types.AlertLevel> } | { __typename?: 'BarChartResult', name: string, barValues: Array<number>, hasConnectedBars?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }> } | { __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, heatMapStyle?: Types.Maybe<Types.HeatMapStyle>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, hasBisector?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'MeanChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, pointCIs: Array<{ __typename?: 'PointCI', min?: Types.Maybe<number>, mean: number, max?: Types.Maybe<number> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, tableStyle?: Types.Maybe<Types.TableStyle>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, heatMapStyle?: Types.Maybe<Types.HeatMapStyle>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, hasBisector?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'MeanChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, pointCIs: Array<{ __typename?: 'PointCI', min?: Types.Maybe<number>, mean: number, max?: Types.Maybe<number> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, tableStyle?: Types.Maybe<Types.TableStyle>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export type CoreGroupInfoFragment = { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>>, datasets?: Types.Maybe<Array<string>> };

export type ListDomainsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, datasets: Array<{ __typename?: 'Dataset', id: string, label?: Types.Maybe<string>, isLongitudinal?: Types.Maybe<boolean> }>, variables: Array<{ __typename?: 'Variable', id: string, label?: Types.Maybe<string>, type?: Types.Maybe<string>, description?: Types.Maybe<string>, datasets?: Types.Maybe<Array<string>>, enumerations?: Types.Maybe<Array<{ __typename?: 'Category', value: string, label?: Types.Maybe<string> }>> }>, rootGroup: { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>>, datasets?: Types.Maybe<Array<string>> }, groups: Array<{ __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>>, datasets?: Types.Maybe<Array<string>> }> }> };

export type CreateExperimentMutationVariables = Types.Exact<{
  data: Types.ExperimentCreateInput;
  isTransient?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CreateExperimentMutation = { __typename?: 'Mutation', createExperiment: { __typename?: 'Experiment', id?: Types.Maybe<string>, name: string, status?: Types.Maybe<Types.ExperimentStatus>, results?: Types.Maybe<Array<{ __typename?: 'AlertResult', title?: Types.Maybe<string>, message: string, level?: Types.Maybe<Types.AlertLevel> } | { __typename?: 'BarChartResult', name: string, barValues: Array<number>, hasConnectedBars?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }> } | { __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'AlertResult', title?: Types.Maybe<string>, message: string, level?: Types.Maybe<Types.AlertLevel> } | { __typename?: 'BarChartResult', name: string, barValues: Array<number>, hasConnectedBars?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }> } | { __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, heatMapStyle?: Types.Maybe<Types.HeatMapStyle>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, hasBisector?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'MeanChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, pointCIs: Array<{ __typename?: 'PointCI', min?: Types.Maybe<number>, mean: number, max?: Types.Maybe<number> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, tableStyle?: Types.Maybe<Types.TableStyle>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, heatMapStyle?: Types.Maybe<Types.HeatMapStyle>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, hasBisector?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'MeanChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, pointCIs: Array<{ __typename?: 'PointCI', min?: Types.Maybe<number>, mean: number, max?: Types.Maybe<number> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, tableStyle?: Types.Maybe<Types.TableStyle>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export type LogoutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type LoginMutationVariables = Types.Exact<{
  username: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthenticationOutput', accessToken: string, refreshToken: string } };

export type UpdateActiveUserMutationVariables = Types.Exact<{
  updateUserInput: Types.UpdateUserInput;
}>;


export type UpdateActiveUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, username: string, fullname?: Types.Maybe<string>, email?: Types.Maybe<string>, agreeNDA?: Types.Maybe<boolean> } };

export type EditExperimentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  data: Types.ExperimentEditInput;
}>;


export type EditExperimentMutation = { __typename?: 'Mutation', editExperiment: { __typename?: 'Experiment', id: string, name: string, viewed?: Types.Maybe<boolean>, shared: boolean, status?: Types.Maybe<Types.ExperimentStatus>, updateAt?: Types.Maybe<string> } };

export type DeleteExperimentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteExperimentMutation = { __typename?: 'Mutation', removeExperiment: { __typename?: 'PartialExperiment', id?: Types.Maybe<string>, status?: Types.Maybe<Types.ExperimentStatus> } };

export const VarBodyFragmentDoc = gql`
    fragment VarBody on VariableParameter {
  hint
  isRequired
  hasMultiple
  allowedTypes
}
    `;
export const CoreGroupInfoFragmentDoc = gql`
    fragment coreGroupInfo on Group {
  id
  label
  description
  groups
  variables
  datasets
}
    `;
export const GetConfigurationDocument = gql`
    query getConfiguration {
  configuration {
    connectorId
    hasGalaxy
    hasGrouping
    hasFilters
    enableSSO
    skipAuth
    skipTos
    version
  }
}
    `;

/**
 * __useGetConfigurationQuery__
 *
 * To run a query within a React component, call `useGetConfigurationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConfigurationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConfigurationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConfigurationQuery(baseOptions?: Apollo.QueryHookOptions<GetConfigurationQuery, GetConfigurationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConfigurationQuery, GetConfigurationQueryVariables>(GetConfigurationDocument, options);
      }
export function useGetConfigurationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConfigurationQuery, GetConfigurationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConfigurationQuery, GetConfigurationQueryVariables>(GetConfigurationDocument, options);
        }
export type GetConfigurationQueryHookResult = ReturnType<typeof useGetConfigurationQuery>;
export type GetConfigurationLazyQueryHookResult = ReturnType<typeof useGetConfigurationLazyQuery>;
export type GetConfigurationQueryResult = Apollo.QueryResult<GetConfigurationQuery, GetConfigurationQueryVariables>;
export const ListAlgorithmsDocument = gql`
    query listAlgorithms {
  algorithms {
    id
    label
    type
    description
    variable {
      ...VarBody
    }
    coVariable {
      ...VarBody
    }
    hasFormula
    parameters {
      __typename
      name
      label
      hint
      isRequired
      hasMultiple
      defaultValue
      ... on NumberParameter {
        min
        max
        isReal
      }
      ... on NominalParameter {
        allowedValues {
          value
          label
        }
        linkedTo
      }
    }
  }
}
    ${VarBodyFragmentDoc}`;

/**
 * __useListAlgorithmsQuery__
 *
 * To run a query within a React component, call `useListAlgorithmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListAlgorithmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListAlgorithmsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListAlgorithmsQuery(baseOptions?: Apollo.QueryHookOptions<ListAlgorithmsQuery, ListAlgorithmsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListAlgorithmsQuery, ListAlgorithmsQueryVariables>(ListAlgorithmsDocument, options);
      }
export function useListAlgorithmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListAlgorithmsQuery, ListAlgorithmsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListAlgorithmsQuery, ListAlgorithmsQueryVariables>(ListAlgorithmsDocument, options);
        }
export type ListAlgorithmsQueryHookResult = ReturnType<typeof useListAlgorithmsQuery>;
export type ListAlgorithmsLazyQueryHookResult = ReturnType<typeof useListAlgorithmsLazyQuery>;
export type ListAlgorithmsQueryResult = Apollo.QueryResult<ListAlgorithmsQuery, ListAlgorithmsQueryVariables>;
export const GetFilterFormulaDataDocument = gql`
    query getFilterFormulaData {
  algorithms {
    id
    label
    hasFormula
  }
  filter {
    numberTypes
  }
  formula {
    variableType
    operationTypes
  }
}
    `;

/**
 * __useGetFilterFormulaDataQuery__
 *
 * To run a query within a React component, call `useGetFilterFormulaDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFilterFormulaDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFilterFormulaDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFilterFormulaDataQuery(baseOptions?: Apollo.QueryHookOptions<GetFilterFormulaDataQuery, GetFilterFormulaDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFilterFormulaDataQuery, GetFilterFormulaDataQueryVariables>(GetFilterFormulaDataDocument, options);
      }
export function useGetFilterFormulaDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFilterFormulaDataQuery, GetFilterFormulaDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFilterFormulaDataQuery, GetFilterFormulaDataQueryVariables>(GetFilterFormulaDataDocument, options);
        }
export type GetFilterFormulaDataQueryHookResult = ReturnType<typeof useGetFilterFormulaDataQuery>;
export type GetFilterFormulaDataLazyQueryHookResult = ReturnType<typeof useGetFilterFormulaDataLazyQuery>;
export type GetFilterFormulaDataQueryResult = Apollo.QueryResult<GetFilterFormulaDataQuery, GetFilterFormulaDataQueryVariables>;
export const GetVariablesFromDomainDocument = gql`
    query getVariablesFromDomain {
  domains {
    variables {
      id
      label
      type
    }
  }
}
    `;

/**
 * __useGetVariablesFromDomainQuery__
 *
 * To run a query within a React component, call `useGetVariablesFromDomainQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVariablesFromDomainQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVariablesFromDomainQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVariablesFromDomainQuery(baseOptions?: Apollo.QueryHookOptions<GetVariablesFromDomainQuery, GetVariablesFromDomainQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVariablesFromDomainQuery, GetVariablesFromDomainQueryVariables>(GetVariablesFromDomainDocument, options);
      }
export function useGetVariablesFromDomainLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVariablesFromDomainQuery, GetVariablesFromDomainQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVariablesFromDomainQuery, GetVariablesFromDomainQueryVariables>(GetVariablesFromDomainDocument, options);
        }
export type GetVariablesFromDomainQueryHookResult = ReturnType<typeof useGetVariablesFromDomainQuery>;
export type GetVariablesFromDomainLazyQueryHookResult = ReturnType<typeof useGetVariablesFromDomainLazyQuery>;
export type GetVariablesFromDomainQueryResult = Apollo.QueryResult<GetVariablesFromDomainQuery, GetVariablesFromDomainQueryVariables>;
export const ActiveUserDocument = gql`
    query activeUser {
  user {
    id
    username
    fullname
    email
    agreeNDA
  }
}
    `;

/**
 * __useActiveUserQuery__
 *
 * To run a query within a React component, call `useActiveUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useActiveUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActiveUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useActiveUserQuery(baseOptions?: Apollo.QueryHookOptions<ActiveUserQuery, ActiveUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActiveUserQuery, ActiveUserQueryVariables>(ActiveUserDocument, options);
      }
export function useActiveUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActiveUserQuery, ActiveUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActiveUserQuery, ActiveUserQueryVariables>(ActiveUserDocument, options);
        }
export type ActiveUserQueryHookResult = ReturnType<typeof useActiveUserQuery>;
export type ActiveUserLazyQueryHookResult = ReturnType<typeof useActiveUserLazyQuery>;
export type ActiveUserQueryResult = Apollo.QueryResult<ActiveUserQuery, ActiveUserQueryVariables>;
export const GetDomainListDocument = gql`
    query getDomainList {
  domains {
    id
    label
    datasets {
      id
      label
      isLongitudinal
    }
  }
}
    `;

/**
 * __useGetDomainListQuery__
 *
 * To run a query within a React component, call `useGetDomainListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDomainListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDomainListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDomainListQuery(baseOptions?: Apollo.QueryHookOptions<GetDomainListQuery, GetDomainListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDomainListQuery, GetDomainListQueryVariables>(GetDomainListDocument, options);
      }
export function useGetDomainListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDomainListQuery, GetDomainListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDomainListQuery, GetDomainListQueryVariables>(GetDomainListDocument, options);
        }
export type GetDomainListQueryHookResult = ReturnType<typeof useGetDomainListQuery>;
export type GetDomainListLazyQueryHookResult = ReturnType<typeof useGetDomainListLazyQuery>;
export type GetDomainListQueryResult = Apollo.QueryResult<GetDomainListQuery, GetDomainListQueryVariables>;
export const GetExperimentListDocument = gql`
    query getExperimentList($name: String = "", $page: Float = 0) {
  experimentList(name: $name, page: $page) {
    totalPages
    currentPage
    totalExperiments
    experiments {
      id
      name
      createdAt
      author {
        username
        fullname
      }
      viewed
      shared
      status
    }
  }
}
    `;

/**
 * __useGetExperimentListQuery__
 *
 * To run a query within a React component, call `useGetExperimentListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExperimentListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExperimentListQuery({
 *   variables: {
 *      name: // value for 'name'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGetExperimentListQuery(baseOptions?: Apollo.QueryHookOptions<GetExperimentListQuery, GetExperimentListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExperimentListQuery, GetExperimentListQueryVariables>(GetExperimentListDocument, options);
      }
export function useGetExperimentListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExperimentListQuery, GetExperimentListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExperimentListQuery, GetExperimentListQueryVariables>(GetExperimentListDocument, options);
        }
export type GetExperimentListQueryHookResult = ReturnType<typeof useGetExperimentListQuery>;
export type GetExperimentListLazyQueryHookResult = ReturnType<typeof useGetExperimentListLazyQuery>;
export type GetExperimentListQueryResult = Apollo.QueryResult<GetExperimentListQuery, GetExperimentListQueryVariables>;
export const GetExperimentDocument = gql`
    query getExperiment($id: String!) {
  experiment(id: $id) {
    name
    id
    domain
    datasets
    author {
      username
      fullname
    }
    filter
    createdAt
    finishedAt
    viewed
    variables
    coVariables
    filterVariables
    shared
    status
    formula {
      interactions
      transformations {
        id
        operation
      }
    }
    algorithm {
      name
      parameters {
        name
        value
      }
    }
    results {
      ... on GroupsResult {
        groups {
          name
          description
          results {
            ...coreInfoResult
          }
        }
      }
      ...coreInfoResult
    }
  }
}
    ${CoreInfoResultFragmentDoc}`;

/**
 * __useGetExperimentQuery__
 *
 * To run a query within a React component, call `useGetExperimentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExperimentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExperimentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetExperimentQuery(baseOptions: Apollo.QueryHookOptions<GetExperimentQuery, GetExperimentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExperimentQuery, GetExperimentQueryVariables>(GetExperimentDocument, options);
      }
export function useGetExperimentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExperimentQuery, GetExperimentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExperimentQuery, GetExperimentQueryVariables>(GetExperimentDocument, options);
        }
export type GetExperimentQueryHookResult = ReturnType<typeof useGetExperimentQuery>;
export type GetExperimentLazyQueryHookResult = ReturnType<typeof useGetExperimentLazyQuery>;
export type GetExperimentQueryResult = Apollo.QueryResult<GetExperimentQuery, GetExperimentQueryVariables>;
export const ListDomainsDocument = gql`
    query listDomains {
  domains {
    id
    label
    description
    datasets {
      id
      label
      isLongitudinal
    }
    variables {
      id
      label
      type
      description
      datasets
      enumerations {
        value
        label
      }
    }
    rootGroup {
      ...coreGroupInfo
    }
    groups {
      ...coreGroupInfo
    }
  }
}
    ${CoreGroupInfoFragmentDoc}`;

/**
 * __useListDomainsQuery__
 *
 * To run a query within a React component, call `useListDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListDomainsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListDomainsQuery(baseOptions?: Apollo.QueryHookOptions<ListDomainsQuery, ListDomainsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListDomainsQuery, ListDomainsQueryVariables>(ListDomainsDocument, options);
      }
export function useListDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListDomainsQuery, ListDomainsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListDomainsQuery, ListDomainsQueryVariables>(ListDomainsDocument, options);
        }
export type ListDomainsQueryHookResult = ReturnType<typeof useListDomainsQuery>;
export type ListDomainsLazyQueryHookResult = ReturnType<typeof useListDomainsLazyQuery>;
export type ListDomainsQueryResult = Apollo.QueryResult<ListDomainsQuery, ListDomainsQueryVariables>;
export const CreateExperimentDocument = gql`
    mutation createExperiment($data: ExperimentCreateInput!, $isTransient: Boolean = true) {
  createExperiment(data: $data, isTransient: $isTransient) {
    id @skip(if: $isTransient)
    name
    status
    results @include(if: $isTransient) {
      ... on GroupsResult {
        groups {
          name
          description
          results {
            ...coreInfoResult
          }
        }
      }
      ...coreInfoResult
    }
  }
}
    ${CoreInfoResultFragmentDoc}`;
export type CreateExperimentMutationFn = Apollo.MutationFunction<CreateExperimentMutation, CreateExperimentMutationVariables>;

/**
 * __useCreateExperimentMutation__
 *
 * To run a mutation, you first call `useCreateExperimentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExperimentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExperimentMutation, { data, loading, error }] = useCreateExperimentMutation({
 *   variables: {
 *      data: // value for 'data'
 *      isTransient: // value for 'isTransient'
 *   },
 * });
 */
export function useCreateExperimentMutation(baseOptions?: Apollo.MutationHookOptions<CreateExperimentMutation, CreateExperimentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExperimentMutation, CreateExperimentMutationVariables>(CreateExperimentDocument, options);
      }
export type CreateExperimentMutationHookResult = ReturnType<typeof useCreateExperimentMutation>;
export type CreateExperimentMutationResult = Apollo.MutationResult<CreateExperimentMutation>;
export type CreateExperimentMutationOptions = Apollo.BaseMutationOptions<CreateExperimentMutation, CreateExperimentMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  login(variables: {username: $username, password: $password}) {
    accessToken
    refreshToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const UpdateActiveUserDocument = gql`
    mutation updateActiveUser($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    id
    username
    fullname
    email
    agreeNDA
  }
}
    `;
export type UpdateActiveUserMutationFn = Apollo.MutationFunction<UpdateActiveUserMutation, UpdateActiveUserMutationVariables>;

/**
 * __useUpdateActiveUserMutation__
 *
 * To run a mutation, you first call `useUpdateActiveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateActiveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateActiveUserMutation, { data, loading, error }] = useUpdateActiveUserMutation({
 *   variables: {
 *      updateUserInput: // value for 'updateUserInput'
 *   },
 * });
 */
export function useUpdateActiveUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateActiveUserMutation, UpdateActiveUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateActiveUserMutation, UpdateActiveUserMutationVariables>(UpdateActiveUserDocument, options);
      }
export type UpdateActiveUserMutationHookResult = ReturnType<typeof useUpdateActiveUserMutation>;
export type UpdateActiveUserMutationResult = Apollo.MutationResult<UpdateActiveUserMutation>;
export type UpdateActiveUserMutationOptions = Apollo.BaseMutationOptions<UpdateActiveUserMutation, UpdateActiveUserMutationVariables>;
export const EditExperimentDocument = gql`
    mutation editExperiment($id: String!, $data: ExperimentEditInput!) {
  editExperiment(id: $id, data: $data) {
    id
    name
    viewed
    shared
    status
    updateAt
  }
}
    `;
export type EditExperimentMutationFn = Apollo.MutationFunction<EditExperimentMutation, EditExperimentMutationVariables>;

/**
 * __useEditExperimentMutation__
 *
 * To run a mutation, you first call `useEditExperimentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditExperimentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editExperimentMutation, { data, loading, error }] = useEditExperimentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useEditExperimentMutation(baseOptions?: Apollo.MutationHookOptions<EditExperimentMutation, EditExperimentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditExperimentMutation, EditExperimentMutationVariables>(EditExperimentDocument, options);
      }
export type EditExperimentMutationHookResult = ReturnType<typeof useEditExperimentMutation>;
export type EditExperimentMutationResult = Apollo.MutationResult<EditExperimentMutation>;
export type EditExperimentMutationOptions = Apollo.BaseMutationOptions<EditExperimentMutation, EditExperimentMutationVariables>;
export const DeleteExperimentDocument = gql`
    mutation deleteExperiment($id: String!) {
  removeExperiment(id: $id) {
    id
    status
  }
}
    `;
export type DeleteExperimentMutationFn = Apollo.MutationFunction<DeleteExperimentMutation, DeleteExperimentMutationVariables>;

/**
 * __useDeleteExperimentMutation__
 *
 * To run a mutation, you first call `useDeleteExperimentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExperimentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExperimentMutation, { data, loading, error }] = useDeleteExperimentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExperimentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExperimentMutation, DeleteExperimentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExperimentMutation, DeleteExperimentMutationVariables>(DeleteExperimentDocument, options);
      }
export type DeleteExperimentMutationHookResult = ReturnType<typeof useDeleteExperimentMutation>;
export type DeleteExperimentMutationResult = Apollo.MutationResult<DeleteExperimentMutation>;
export type DeleteExperimentMutationOptions = Apollo.BaseMutationOptions<DeleteExperimentMutation, DeleteExperimentMutationVariables>;
export const namedOperations = {
  Query: {
    getConfiguration: 'getConfiguration',
    listAlgorithms: 'listAlgorithms',
    getFilterFormulaData: 'getFilterFormulaData',
    getVariablesFromDomain: 'getVariablesFromDomain',
    activeUser: 'activeUser',
    getDomainList: 'getDomainList',
    getExperimentList: 'getExperimentList',
    getExperiment: 'getExperiment',
    listDomains: 'listDomains'
  },
  Mutation: {
    createExperiment: 'createExperiment',
    logout: 'logout',
    login: 'login',
    updateActiveUser: 'updateActiveUser',
    editExperiment: 'editExperiment',
    deleteExperiment: 'deleteExperiment'
  },
  Fragment: {
    VarBody: 'VarBody',
    coreGroupInfo: 'coreGroupInfo'
  }
}