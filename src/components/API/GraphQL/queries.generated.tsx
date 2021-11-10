import * as Types from './types.generated';

import { gql } from '@apollo/client';
import { CoreInfoResultFragmentDoc } from './fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetExperimentQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetExperimentQuery = { __typename?: 'Query', experiment: { __typename?: 'Experiment', name: string, id?: Types.Maybe<string>, domain: string, datasets: Array<string>, author?: Types.Maybe<string>, filter?: Types.Maybe<string>, createdAt?: Types.Maybe<number>, finishedAt?: Types.Maybe<number>, viewed?: Types.Maybe<boolean>, variables: Array<string>, coVariables?: Types.Maybe<Array<string>>, shared: boolean, status?: Types.Maybe<string>, algorithm: { __typename?: 'Algorithm', id: string, description?: Types.Maybe<string>, label?: Types.Maybe<string>, type?: Types.Maybe<string>, parameters?: Types.Maybe<Array<{ __typename?: 'AlgorithmParameter', id: string, label?: Types.Maybe<string>, value?: Types.Maybe<Array<string>> }>> }, results?: Types.Maybe<Array<{ __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export type CoreGroupInfoFragment = { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> };

export type ListDomainsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, datasets: Array<{ __typename?: 'Category', id: string, label?: Types.Maybe<string> }>, variables: Array<{ __typename?: 'Variable', id: string, label?: Types.Maybe<string>, type?: Types.Maybe<string>, description?: Types.Maybe<string>, enumerations?: Types.Maybe<Array<{ __typename?: 'Category', id: string, label?: Types.Maybe<string> }>> }>, rootGroup: { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> }, groups: Array<{ __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> }> }> };

export type CreateTransientMutationVariables = Types.Exact<{
  data: Types.ExperimentCreateInput;
}>;


export type CreateTransientMutation = { __typename?: 'Mutation', createExperiment: { __typename?: 'Experiment', name: string, results?: Types.Maybe<Array<{ __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export type EditExperimentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  data: Types.ExperimentEditInput;
}>;


export type EditExperimentMutation = { __typename?: 'Mutation', editExperiment: { __typename?: 'Experiment', id?: Types.Maybe<string>, name: string, viewed?: Types.Maybe<boolean>, shared: boolean, status?: Types.Maybe<string>, updateAt?: Types.Maybe<number> } };

export type DeleteExperimentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteExperimentMutation = { __typename?: 'Mutation', removeExperiment: { __typename?: 'PartialExperiment', id?: Types.Maybe<string>, status?: Types.Maybe<string> } };

export const CoreGroupInfoFragmentDoc = gql`
    fragment coreGroupInfo on Group {
  id
  label
  description
  groups
  variables
}
    `;
export const GetExperimentDocument = gql`
    query getExperiment($id: String!) {
  experiment(id: $id) {
    name
    id
    domain
    datasets
    author
    filter
    createdAt
    finishedAt
    viewed
    variables
    coVariables
    shared
    status
    algorithm {
      id
      description
      label
      type
      parameters {
        id
        label
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
    getExperiment: 'getExperiment',
    listDomains: 'listDomains'
  },
  Mutation: {
    createTransient: 'createTransient',
    editExperiment: 'editExperiment',
    deleteExperiment: 'deleteExperiment'
  },
  Fragment: {
    coreGroupInfo: 'coreGroupInfo'
  }
}