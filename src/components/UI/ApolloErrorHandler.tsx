import React from 'react';
import { GraphQLError } from 'graphql';
import Error from './Error';
import Warning from './Visualization/Warning';

export default ({ error }: { error: GraphQLError }): JSX.Element => {
  const statusCode = error.extensions ? Number(error.extensions['code']) : 200;

  return (
    <>
      <h1>Error {statusCode}</h1>
      {statusCode >= 500 && <Error message={error.message} />}
      {statusCode >= 400 && <Warning message={error.message} />}
    </>
  );
};
