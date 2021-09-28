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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
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

export type DummyResult = {
  __typename?: 'DummyResult';
  data: Array<Array<Scalars['String']>>;
  groupBy?: Maybe<Scalars['String']>;
  listMax: Array<Scalars['String']>;
  name: Scalars['String'];
};

export type Experiment = {
  __typename?: 'Experiment';
  created_at?: Maybe<Scalars['DateTime']>;
  finished_at?: Maybe<Scalars['DateTime']>;
  results: Array<ResultUnion>;
  title: Scalars['String'];
  update_at?: Maybe<Scalars['DateTime']>;
  uuid?: Maybe<Scalars['String']>;
};

export type ExperimentCreateInput = {
  algorithm: Scalars['String'];
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  variables: Array<Scalars['String']>;
};

export type Group = {
  __typename?: 'Group';
  description?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  variables: Array<Variable>;
};

export type MetaData = {
  __typename?: 'MetaData';
  name: Scalars['String'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTransient: Experiment;
};

export type MutationCreateTransientArgs = {
  data: ExperimentCreateInput;
};

export type Query = {
  __typename?: 'Query';
  domains: Array<Domain>;
};

export type QueryDomainsArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
};

export type ResultUnion = DummyResult | TableResult;

export type TableResult = {
  __typename?: 'TableResult';
  data: Array<Array<Scalars['String']>>;
  groupBy?: Maybe<Scalars['String']>;
  metadatas: Array<MetaData>;
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

export type CreateTransientMutationVariables = Exact<{
  data: ExperimentCreateInput;
}>;

export type CreateTransientMutation = {
  __typename?: 'Mutation';
  createTransient: {
    __typename?: 'Experiment';
    title: string;
    results: Array<
      | { __typename?: 'DummyResult' }
      | {
          __typename?: 'TableResult';
          groupBy?: Maybe<string>;
          name: string;
          data: Array<Array<string>>;
          metadatas: Array<{
            __typename?: 'MetaData';
            name: string;
            type: string;
          }>;
        }
    >;
  };
};

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
      groups {
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
    }
  }
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
    createTransient(data: $data) {
      title
      results {
        ... on TableResult {
          groupBy
          name
          data
          metadatas {
            name
            type
          }
        }
      }
    }
  }
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
