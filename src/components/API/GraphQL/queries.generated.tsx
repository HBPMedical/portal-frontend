import * as Types from './types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CoreGroupInfoFragment = { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, variables?: Types.Maybe<Array<string>>, groups?: Types.Maybe<Array<{ __typename?: 'Group', id: string }>> };

export type ListDomainsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, datasets: Array<{ __typename?: 'Category', id: string, label?: Types.Maybe<string> }>, variables: Array<{ __typename?: 'Variable', id: string, label?: Types.Maybe<string>, type: string, description?: Types.Maybe<string>, enumerations?: Types.Maybe<Array<{ __typename?: 'Category', id: string, label?: Types.Maybe<string> }>> }>, rootGroup: { __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, variables?: Types.Maybe<Array<string>>, groups?: Types.Maybe<Array<{ __typename?: 'Group', id: string }>> }, groups: Array<{ __typename?: 'Group', id: string, label?: Types.Maybe<string>, description?: Types.Maybe<string>, variables?: Types.Maybe<Array<string>>, groups?: Types.Maybe<Array<{ __typename?: 'Group', id: string }>> }> }> };

export type CoreInfoResult_GroupsResult_Fragment = { __typename?: 'GroupsResult' };

export type CoreInfoResult_RawResult_Fragment = { __typename?: 'RawResult', rawdata: any };

export type CoreInfoResult_TableResult_Fragment = { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> };

export type CoreInfoResultFragment = CoreInfoResult_GroupsResult_Fragment | CoreInfoResult_RawResult_Fragment | CoreInfoResult_TableResult_Fragment;

export type CreateTransientMutationVariables = Types.Exact<{
  data: Types.ExperimentCreateInput;
}>;


export type CreateTransientMutation = { __typename?: 'Mutation', createExperiment: { __typename?: 'Experiment', name: string, results?: Types.Maybe<Array<{ __typename?: 'GroupsResult', groups: Array<{ __typename?: 'GroupResult', name: string, description?: Types.Maybe<string>, results: Array<{ __typename?: 'GroupsResult' } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }> }> } | { __typename?: 'RawResult', rawdata: any } | { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> }>> } };

export const CoreGroupInfoFragmentDoc = gql`
    fragment coreGroupInfo on Group {
  id
  label
  description
  groups {
    id
  }
  variables
}
    `;
export const CoreInfoResultFragmentDoc = gql`
    fragment coreInfoResult on ResultUnion {
  ... on TableResult {
    name
    data
    headers {
      name
      type
    }
  }
  ... on RawResult {
    rawdata
  }
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
    mutation CreateTransient($data: ExperimentCreateInput!) {
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