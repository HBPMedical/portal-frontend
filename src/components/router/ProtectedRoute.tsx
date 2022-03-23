import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { configurationVar, currentUserVar } from '../API/GraphQL/cache';

// screen if you're not yet authenticated.

type Props = {
  children: React.ReactNode;
} & RouteProps;

export default ({ children, ...rest }: Props) => {
  const user = useReactiveVar(currentUserVar);
  const config = useReactiveVar(configurationVar);
  const isAuth = !!user;
  const skipTOS = user?.agreeNDA || config.skipTos;

  return (
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
  );
};
