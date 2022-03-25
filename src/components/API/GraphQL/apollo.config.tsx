import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { SessionState } from '../../../utilities/types';
import config from '../RequestHeaders';
import { graphQLURL } from '../RequestURLS';
import { cache, sessionStateVar } from './cache';

const excludedPaths = ['/login', '/access', '/tos'];
const excludedDomains = ['login', 'logout'];

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (
    excludedDomains.includes(operation.operationName) ||
    excludedPaths.includes(window.location.pathname)
  )
    return;
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      switch (extensions?.status || -1) {
        case 401:
          sessionStateVar(SessionState.INVALID);
          break;
        case 403:
          sessionStateVar(SessionState.ACCESS_DENIED);
          break;
      }

      console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`);
    });
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
