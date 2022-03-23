import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { graphQLURL } from '../RequestURLS';
import { cache } from './cache';
import config from '../RequestHeaders';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    new HttpLink({ uri: graphQLURL, credentials: 'include' })
  ]),
  headers: {
    ...config.options?.headers,
    accept: 'application/json, text/plain, */*'
  },
  cache: cache,
  credentials: 'include'
});
