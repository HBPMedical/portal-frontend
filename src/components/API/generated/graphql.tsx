/* eslint-disable @typescript-eslint/camelcase */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Algorithm = {
  __typename?: 'Algorithm';
  name: Scalars['String'];
  parameters?: Maybe<Array<AlgorithmParameter>>;
  type: Scalars['String'];
};

export type AlgorithmInput = {
  name: Scalars['String'];
  parameters?: Maybe<Array<AlgorithmParamInput>>;
  type: Scalars['String'];
};

export type AlgorithmParamInput = {
  name: Scalars['String'];
  value: Array<Scalars['String']>;
};

export type AlgorithmParameter = {
  __typename?: 'AlgorithmParameter';
  name: Scalars['String'];
  value: Array<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
};

export type Domain = {
  __typename?: 'Domain';
  datasets: Array<Category>;
  description?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  rootGroup: Group;
  variables: Array<Variable>;
};

export type Experiment = {
  __typename?: 'Experiment';
  algorithm: Algorithm;
  author?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Float']>;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  finishedAt?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  results?: Maybe<Array<ResultUnion>>;
  shared: Scalars['Boolean'];
  status?: Maybe<Scalars['String']>;
  updateAt?: Maybe<Scalars['Float']>;
  uuid?: Maybe<Scalars['String']>;
  variables: Array<Scalars['String']>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type ExperimentCreateInput = {
  algorithm: AlgorithmInput;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  variables: Array<Scalars['String']>;
};

export type ExperimentEditInput = {
  name?: Maybe<Scalars['String']>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type Group = {
  __typename?: 'Group';
  description?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  variables: Array<Variable>;
};

export type GroupResult = {
  __typename?: 'GroupResult';
  name: Scalars['String'];
  results: Array<ResultUnion>;
};

export type GroupsResult = {
  __typename?: 'GroupsResult';
  groups: Array<GroupResult>;
};

export type Header = {
  __typename?: 'Header';
  name: Scalars['String'];
  type: Scalars['String'];
};

export type ListExperiments = {
  __typename?: 'ListExperiments';
  currentPage?: Maybe<Scalars['Float']>;
  experiments: Array<Experiment>;
  totalExperiments?: Maybe<Scalars['Float']>;
  totalPages?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createExperiment: Experiment;
  editExperiment: Experiment;
  removeExperiment: PartialExperiment;
};

export type MutationCreateExperimentArgs = {
  data: ExperimentCreateInput;
  isTransient?: Maybe<Scalars['Boolean']>;
};

export type MutationEditExperimentArgs = {
  data: ExperimentEditInput;
  uuid: Scalars['String'];
};

export type MutationRemoveExperimentArgs = {
  uuid: Scalars['String'];
};

export type PartialExperiment = {
  __typename?: 'PartialExperiment';
  algorithm?: Maybe<Algorithm>;
  author?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Float']>;
  datasets?: Maybe<Array<Scalars['String']>>;
  domain?: Maybe<Scalars['String']>;
  filter?: Maybe<Scalars['String']>;
  finishedAt?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  results?: Maybe<Array<ResultUnion>>;
  shared?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  updateAt?: Maybe<Scalars['Float']>;
  uuid?: Maybe<Scalars['String']>;
  variables?: Maybe<Array<Scalars['String']>>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  domains: Array<Domain>;
  experiments: ListExperiments;
  expriment: Experiment;
};

export type QueryDomainsArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
};

export type QueryExperimentsArgs = {
  name?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Float']>;
};

export type QueryExprimentArgs = {
  uuid: Scalars['String'];
};

export type RawResult = {
  __typename?: 'RawResult';
  data: Scalars['JSONObject'];
  listMax: Array<Scalars['String']>;
};

export type ResultUnion = GroupsResult | RawResult | TableResult;

export type TableResult = {
  __typename?: 'TableResult';
  data: Array<Array<Scalars['String']>>;
  headers: Array<Header>;
  name: Scalars['String'];
};

export type Variable = {
  __typename?: 'Variable';
  description?: Maybe<Scalars['String']>;
  enumerations: Array<Category>;
  groups: Array<Group>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type CoreGroupInfoFragment = {
  __typename?: 'Group';
  id: string;
  label?: Maybe<string>;
  description?: Maybe<string>;
  groups: Array<{ __typename?: 'Group'; id: string }>;
  variables: Array<{ __typename?: 'Variable'; id: string }>;
};

export type ListDomainsQueryVariables = Exact<{ [key: string]: never }>;

export type ListDomainsQuery = {
  __typename?: 'Query';
  domains: Array<{
    __typename?: 'Domain';
    id: string;
    label?: Maybe<string>;
    description?: Maybe<string>;
    datasets: Array<{
      __typename?: 'Category';
      id: string;
      label?: Maybe<string>;
    }>;
    variables: Array<{
      __typename?: 'Variable';
      id: string;
      label?: Maybe<string>;
      type: string;
      description?: Maybe<string>;
      enumerations: Array<{
        __typename?: 'Category';
        id: string;
        label?: Maybe<string>;
      }>;
    }>;
    rootGroup: {
      __typename?: 'Group';
      id: string;
      label?: Maybe<string>;
      description?: Maybe<string>;
      groups: Array<{ __typename?: 'Group'; id: string }>;
      variables: Array<{ __typename?: 'Variable'; id: string }>;
    };
    groups: Array<{
      __typename?: 'Group';
      id: string;
      label?: Maybe<string>;
      description?: Maybe<string>;
      groups: Array<{ __typename?: 'Group'; id: string }>;
      variables: Array<{ __typename?: 'Variable'; id: string }>;
    }>;
  }>;
};

type CoreInfoResult_GroupsResult_Fragment = { __typename?: 'GroupsResult' };

type CoreInfoResult_RawResult_Fragment = { __typename?: 'RawResult' };

type CoreInfoResult_TableResult_Fragment = {
  __typename?: 'TableResult';
  name: string;
  data: Array<Array<string>>;
  headers: Array<{ __typename?: 'Header'; name: string; type: string }>;
};

export type CoreInfoResultFragment =
  | CoreInfoResult_GroupsResult_Fragment
  | CoreInfoResult_RawResult_Fragment
  | CoreInfoResult_TableResult_Fragment;

export type CreateTransientMutationVariables = Exact<{
  data: ExperimentCreateInput;
}>;

export type CreateTransientMutation = {
  __typename?: 'Mutation';
  createExperiment: {
    __typename?: 'Experiment';
    name: string;
    results?: Maybe<
      Array<
        | {
            __typename?: 'GroupsResult';
            groups: Array<{
              __typename?: 'GroupResult';
              name: string;
              results: Array<
                | { __typename?: 'GroupsResult' }
                | { __typename?: 'RawResult' }
                | {
                    __typename?: 'TableResult';
                    name: string;
                    data: Array<Array<string>>;
                    headers: Array<{
                      __typename?: 'Header';
                      name: string;
                      type: string;
                    }>;
                  }
              >;
            }>;
          }
        | { __typename?: 'RawResult' }
        | { __typename?: 'TableResult' }
      >
    >;
  };
};

export const CoreGroupInfoFragmentDoc = gql`
  fragment coreGroupInfo on Group {
    id
    label
    description
    groups {
      id
    }
    variables {
      id
    }
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
  ${CoreGroupInfoFragmentDoc}
`;

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
export function useListDomainsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ListDomainsQuery,
    ListDomainsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListDomainsQuery, ListDomainsQueryVariables>(
    ListDomainsDocument,
    options
  );
}
export function useListDomainsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ListDomainsQuery,
    ListDomainsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListDomainsQuery, ListDomainsQueryVariables>(
    ListDomainsDocument,
    options
  );
}
export type ListDomainsQueryHookResult = ReturnType<typeof useListDomainsQuery>;
export type ListDomainsLazyQueryHookResult = ReturnType<
  typeof useListDomainsLazyQuery
>;
export type ListDomainsQueryResult = Apollo.QueryResult<
  ListDomainsQuery,
  ListDomainsQueryVariables
>;
export const CreateTransientDocument = gql`
  mutation CreateTransient($data: ExperimentCreateInput!) {
    createExperiment(data: $data, isTransient: true) {
      name
      results {
        ... on GroupsResult {
          groups {
            name
            results {
              ...coreInfoResult
            }
          }
          ...coreInfoResult
        }
      }
    }
  }
  ${CoreInfoResultFragmentDoc}
`;
export type CreateTransientMutationFn = Apollo.MutationFunction<
  CreateTransientMutation,
  CreateTransientMutationVariables
>;

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
export function useCreateTransientMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTransientMutation,
    CreateTransientMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateTransientMutation,
    CreateTransientMutationVariables
  >(CreateTransientDocument, options);
}
export type CreateTransientMutationHookResult = ReturnType<
  typeof useCreateTransientMutation
>;
export type CreateTransientMutationResult = Apollo.MutationResult<
  CreateTransientMutation
>;
export type CreateTransientMutationOptions = Apollo.BaseMutationOptions<
  CreateTransientMutation,
  CreateTransientMutationVariables
>;
