import { NetworkStatus } from '@apollo/client';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import styled from 'styled-components';
import {
  useActiveUserQuery,
  useGetConfigurationQuery,
} from '../API/GraphQL/queries.generated';

const SpinnerContainer = styled.div`
  display: flex;
  min-height: inherit;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

type Props = {
  children: React.ReactNode;
} & RouteProps;

const ProtectedRoute = ({ children, ...rest }: Props) => {
  const {
    loading: userLoading,
    data: userData,
    networkStatus,
  } = useActiveUserQuery();
  const { loading: configLoading, data: { configuration } = {} } =
    useGetConfigurationQuery();

  const isAuth = !!userData?.user;
  const skipTOS = userData?.user?.agreeNDA || configuration?.skipTos;
  const loading =
    userLoading || configLoading || networkStatus === NetworkStatus.refetch;

  return (
    <>
      {!loading ? (
        <Route
          {...rest}
          render={({ location }) => {
            if (!isAuth) {
              return (
                <Redirect
                  to={{ pathname: '/access', state: { from: location } }}
                />
              );
            }

            if (!skipTOS) {
              return (
                <Redirect
                  to={{ pathname: '/tos', state: { from: location } }}
                />
              );
            }

            return children;
          }}
        />
      ) : (
        <SpinnerContainer>
          <Spinner animation="border" variant="info" />
        </SpinnerContainer>
      )}
    </>
  );
};

export default ProtectedRoute;
