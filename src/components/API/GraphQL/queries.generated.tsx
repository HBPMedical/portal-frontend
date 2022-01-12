import * as Types from './types.generated';

import { gql } from '@apollo/client';
import { CoreInfoResultFragmentDoc } from './fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetVariablesFromDomainQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetVariablesFromDomainQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', variables: Array<{ __typename?: 'Variable', id: string, label?: Types.Maybe<string>, type?: Types.Maybe<string> }> }> };

export type GetDomainListQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDomainListQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', id: string, label?: Types.Maybe<string>, datasets: Array<{ __typename?: 'Dataset', id: string, label?: Types.Maybe<string>, isLongitudinal?: Types.Maybe<boolean> }> }> };

export type GetExperimentListQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
  page?: Types.Maybe<Types.Scalars['Float']>;
}>;


export type GetExperimentListQuery = { __typename?: 'Query', experimentList: { __typename?: 'ListExperiments', totalPages?: Types.Maybe<number>, currentPage?: Types.Maybe<number>, totalExperiments?: Types.Maybe<number>, experiments: Array<{ __typename?: 'Experiment', id: string, name: string, createdAt?: Types.Maybe<number>, viewed?: Types.Maybe<boolean>, shared: boolean, status?: Types.Maybe<string>, author?: Types.Maybe<{ __typename?: 'Author', username?: Types.Maybe<string>, fullname?: Types.Maybe<string> }> }> } };

export type GetExperimentQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetExperimentQuery = { __typename?: 'Query', experiment: { __typename?: 'Experiment', name: string, id: string, domain: string, datasets: Array<string>, filter?: Types.Maybe<string>, createdAt?: Types.Maybe<number>, finishedAt?: Types.Maybe<number>, viewed?: Types.Maybe<boolean>, variables: Array<string>, coVariables?: Types.Maybe<Array<string>>, shared: boolean, status?: Types.Maybe<string>, author?: Types.Maybe<{ __typename?: 'Author', username?: Types.Maybe<string>, fullname?: Types.Maybe<string> }>, algorithm: { __typename?: 'Algorithm', id: string, description?: Types.Maybe<string>, label?: Types.Maybe<string>, type?: Types.Maybe<string>, parameters?: Types.Maybe<Array<{ __typename?: 'AlgorithmParameter', id: string, label?: Types.Maybe<string>, value?: Types.Maybe<Array<string>> }>> }, results?: Types.Maybe<Array<{ __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export type CoreGroupInfoFragment = { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> };

export type ListDomainsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, datasets: Array<{ __typename?: 'Dataset', id: string, label?: Types.Maybe<string>, isLongitudinal?: Types.Maybe<boolean> }>, variables: Array<{ __typename?: 'Variable', id: string, label?: Types.Maybe<string>, type?: Types.Maybe<string>, description?: Types.Maybe<string>, enumerations?: Types.Maybe<Array<{ __typename?: 'Category', id: string, label?: Types.Maybe<string> }>> }>, rootGroup: { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> }, groups: Array<{ __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, groups?: Types.Maybe<Array<string>>, variables?: Types.Maybe<Array<string>> }> }> };

export type CreateExperimentMutationVariables = Types.Exact<{
  data: Types.ExperimentCreateInput;
  isTransient?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CreateExperimentMutation = { __typename?: 'Mutation', createExperiment: { __typename?: 'Experiment', id?: Types.Maybe<string>, name: string, status?: Types.Maybe<string>, results?: Types.Maybe<Array<{ __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'GroupsResult' } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> } | { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> } | { __typename?: 'RawResult', rawdata?: Types.Maybe<any> } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export type EditExperimentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  data: Types.ExperimentEditInput;
}>;


export type EditExperimentMutation = { __typename?: 'Mutation', editExperiment: { __typename?: 'Experiment', id: string, name: string, viewed?: Types.Maybe<boolean>, shared: boolean, status?: Types.Maybe<string>, updateAt?: Types.Maybe<number> } };

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
export const GetVariablesFromDomainDocument = gql`
    query getVariablesFromDomain($id: String!) {
  domains(ids: [$id]) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetVariablesFromDomainQuery(baseOptions: Apollo.QueryHookOptions<GetVariablesFromDomainQuery, GetVariablesFromDomainQueryVariables>) {
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
      isLongitudinal
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
    getVariablesFromDomain: 'getVariablesFromDomain',
    getDomainList: 'getDomainList',
    getExperimentList: 'getExperimentList',
    getExperiment: 'getExperiment',
    listDomains: 'listDomains'
  },
  Mutation: {
    createExperiment: 'createExperiment',
    editExperiment: 'editExperiment',
    deleteExperiment: 'deleteExperiment'
  },
  Fragment: {
    coreGroupInfo: 'coreGroupInfo'
  }
}