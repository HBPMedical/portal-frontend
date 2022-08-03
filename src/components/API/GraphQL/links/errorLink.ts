import { Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { SessionState } from '../../../../utilities/types';
import { REFRESH_TOKEN_KEY_NAME } from '../../../constants';
import { graphQLURL } from '../../RequestURLS';
import { sessionStateVar } from '../cache';

const excludedPaths = ['/login', '/access', '/tos'];
const excludedDomains = ['login', 'logout', 'refresh'];
const queryRefresh = (token: string) => `
mutation {
  refresh(refreshToken: "${token}") {
		refreshToken
  }
}
`;

const hasRefreshToken = (): boolean => {
  return !!localStorage.getItem(REFRESH_TOKEN_KEY_NAME);
};

const renewToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY_NAME);

  if (!refreshToken) return;

  localStorage.removeItem(REFRESH_TOKEN_KEY_NAME);

  try {
    const response = await fetch(graphQLURL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: queryRefresh(refreshToken)
      })
    });

    if (!response || !response.ok) return;

    response.json().then(res => {
      if (res.data && res.data.refresh && res.data.refresh.refreshToken) {
        localStorage.setItem(
          REFRESH_TOKEN_KEY_NAME,
          res.data.refresh.refreshToken
        );
      }
    });
  } catch (error) {
    console.error('Cannot refresh access token: ', error);
  }
};

// This promise is used to prevent multiple requests from all fetching a new access token at the same time.
let refreshTokenPromise: Promise<void> | null;

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (
      graphQLErrors &&
      graphQLErrors.some(error => error.extensions?.status === 401) &&
      (hasRefreshToken() || !!refreshTokenPromise)
    ) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = renewToken().then(() => {
          refreshTokenPromise = null;
        });
      }

      return new Observable(observer => {
        refreshTokenPromise?.then(() => {
          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          };

          //Retry the operation again
          forward(operation).subscribe(subscriber);
        });
      });
    }

    if (
      excludedDomains.includes(operation?.operationName) ||
      excludedPaths.includes(window?.location?.pathname)
    )
      return;

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path, extensions }) => {
        switch (extensions?.status || -1) {
          case 401:
            if (sessionStateVar() !== SessionState.INVALID)
              sessionStateVar(SessionState.INVALID);
            break;
          case 403:
            if (sessionStateVar() !== SessionState.ACCESS_DENIED)
              sessionStateVar(SessionState.ACCESS_DENIED);
            break;
        }

        console.log(
          `[GraphQL error]: Message: ${message}, Path: ${path}, Extensions: ${JSON.stringify(
            extensions
          )}`
        );
      });
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

export default errorLink;
