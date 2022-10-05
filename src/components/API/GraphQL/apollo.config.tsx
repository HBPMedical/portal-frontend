import { ApolloClient, from, HttpLink } from '@apollo/client';
import RequestHeaders from '../RequestHeaders';
import { graphQLURL } from '../RequestURLS';
import { cache } from './cache';
import errorLink from './links/errorLink';

export const apolloClient = new ApolloClient({
  link: from([
    errorLink,
    new HttpLink({
      uri: graphQLURL,
      credentials: 'include',
      headers: {
        ...RequestHeaders.options?.headers,
        accept: 'application/json, text/plain, */*',
      },
    }),
  ]),
  cache: cache,
});
