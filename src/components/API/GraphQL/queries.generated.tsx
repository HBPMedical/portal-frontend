import * as Types from './types.generated';

import { gql } from '@apollo/client';
import { CoreInfoResultFragmentDoc } from './fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CoreGroupInfoFragment = { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> };

export type ListDomainsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, datasets: Array<{ __typename?: 'Category', id: string, label?: Types.Maybe<string> }>, variables: Array<{ __typename?: 'Variable', id: string, label?: Types.Maybe<string>, type?: Types.Maybe<string>, description?: Types.Maybe<string>, enumerations?: Types.Maybe<Array<{ __typename?: 'Category', id: string, label?: Types.Maybe<string> }>> }>, rootGroup: { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> }, groups: Array<{ __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> }> }> };

export type CreateTransientMutationVariables = Types.Exact<{
  data: Types.ExperimentCreateInput;
}>;


export type CreateTransientMutation = { __typename?: 'Mutation', createExperiment: { __typename?: 'Experiment', name: string, results?: Types.Maybe<Array<{ __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export type ExperimentQueryVariables = Types.Exact<{
  uuid: Types.Scalars['String'];
}>;


export type ExperimentQuery = { __typename?: 'Query', expriment: { __typename?: 'Experiment', name: string, uuid?: Types.Maybe<string>, author?: Types.Maybe<string>, createdAt?: Types.Maybe<number>, finishedAt?: Types.Maybe<number>, viewed?: Types.Maybe<boolean>, shared: boolean, algorithm: { __typename?: 'Algorithm', name: string, description?: Types.Maybe<string>, label?: Types.Maybe<string>, type?: Types.Maybe<string>, parameters?: Types.Maybe<Array<{ __typename?: 'AlgorithmParameter', name: string, label?: Types.Maybe<string>, value?: Types.Maybe<Array<string>> }>> }, results?: Types.Maybe<Array<{ __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export const CoreGroupInfoFragmentDoc = gql`
    fragment coreGroupInfo on Group {
  id
  label
  description
  groups
  variables
}
    `;
export const ListDomainsDocument = gql`
    query listDomains {
  domains {
    id
    label
    description
    datasets {
      id
      label
    }
    variables {
      id
      label
      type
      description
      enumerations {
        id
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
export const CreateTransientDocument = gql`
    mutation createTransient($data: ExperimentCreateInput!) {
  createExperiment(data: $data, isTransient: true) {
    name
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
export type CreateTransientMutationFn = Apollo.MutationFunction<CreateTransientMutation, CreateTransientMutationVariables>;

/**
 * __useCreateTransientMutation__
 *
 * To run a mutation, you first call `useCreateTransientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTransientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTransientMutation, { data, loading, error }] = useCreateTransientMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateTransientMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransientMutation, CreateTransientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransientMutation, CreateTransientMutationVariables>(CreateTransientDocument, options);
      }
export type CreateTransientMutationHookResult = ReturnType<typeof useCreateTransientMutation>;
export type CreateTransientMutationResult = Apollo.MutationResult<CreateTransientMutation>;
export type CreateTransientMutationOptions = Apollo.BaseMutationOptions<CreateTransientMutation, CreateTransientMutationVariables>;
export const ExperimentDocument = gql`
    query experiment($uuid: String!) {
  expriment(uuid: $uuid) {
    name
    uuid
    author
    createdAt
    finishedAt
    viewed
    shared
    algorithm {
      name
      description
      label
      type
      parameters {
        name
        label
        value
      }
    }
    results {
      ...coreInfoResult
    }
  }
}
    ${CoreInfoResultFragmentDoc}`;

/**
 * __useExperimentQuery__
 *
 * To run a query within a React component, call `useExperimentQuery` and pass it any options that fit your needs.
 * When your component renders, `useExperimentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExperimentQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useExperimentQuery(baseOptions: Apollo.QueryHookOptions<ExperimentQuery, ExperimentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExperimentQuery, ExperimentQueryVariables>(ExperimentDocument, options);
      }
export function useExperimentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExperimentQuery, ExperimentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExperimentQuery, ExperimentQueryVariables>(ExperimentDocument, options);
        }
export type ExperimentQueryHookResult = ReturnType<typeof useExperimentQuery>;
export type ExperimentLazyQueryHookResult = ReturnType<typeof useExperimentLazyQuery>;
export type ExperimentQueryResult = Apollo.QueryResult<ExperimentQuery, ExperimentQueryVariables>;
