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
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['String'];
  label: Scalars['String'];
};

export type Domain = {
  __typename?: 'Domain';
  datasets: Array<Category>;
  description?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  id: Scalars['String'];
  label: Scalars['String'];
  variables: Array<Variable>;
};

export type Group = {
  __typename?: 'Group';
  description?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  id: Scalars['String'];
  label: Scalars['String'];
  variables: Array<Variable>;
};

export type Query = {
  __typename?: 'Query';
  domains: Array<Domain>;
};

export type QueryDomainsArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
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
    label: string;
    description?: Maybe<string>;
    datasets: Array<{ __typename?: 'Category'; id: string; label: string }>;
    variables: Array<{
      __typename?: 'Variable';
      id: string;
      label?: Maybe<string>;
      type: string;
      description?: Maybe<string>;
      enumerations: Array<{
        __typename?: 'Category';
        id: string;
        label: string;
      }>;
    }>;
    groups: Array<{
      __typename?: 'Group';
      id: string;
      label: string;
      description?: Maybe<string>;
      groups: Array<{ __typename?: 'Group'; id: string }>;
      variables: Array<{ __typename?: 'Variable'; id: string }>;
    }>;
  }>;
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
