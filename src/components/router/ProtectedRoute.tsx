import { NetworkStatus } from '@apollo/client';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import {
  useActiveUserQuery,
  useGetConfigurationQuery
} from '../API/GraphQL/queries.generated';

// screen if you're not yet authenticated.

type Props = {
  children: React.ReactNode;
} & RouteProps;

export default ({ children, ...rest }: Props) => {
  const {
    loading: userLoading,
    data: userData,
    networkStatus
  } = useActiveUserQuery();
  const {
    loading: configLoading,
    data: { configuration } = {}
  } = useGetConfigurationQuery({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  });

  const isAuth = !!userData?.user;
  const skipTOS = userData?.user?.agreeNDA || configuration?.skipTos;
  const loading =
    userLoading || configLoading || networkStatus === NetworkStatus.refetch;

  return (
    <>
      {!loading && (
        <Route
          {...rest}
          render={({ location }) =>
            isAuth ? (
              skipTOS ? (
                children
              ) : (
                <Redirect
                  to={{
                    pathname: '/tos',
                    state: { from: location }
                  }}
                />
              )
            ) : (
              <Redirect
                to={{
                  pathname: '/access',
                  state: { from: location }
                }}
              />
            )
          }
        />
      )}
    </>
  );
};
