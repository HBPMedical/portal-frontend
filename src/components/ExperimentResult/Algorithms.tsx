import * as React from 'react';
import styled from 'styled-components';
import { Algorithm } from '../API/GraphQL/types.generated';

const Param = styled.p`
  overflow: wrap;
  width: 200px;
  word-wrap: break-word;
  display: inline-block;
`;

const Algorithms = ({
  algorithm
}: {
  algorithm?: Algorithm;
}): JSX.Element | null => {
  return (
    <>
      <h4>Algorithm</h4>
      {algorithm && (
        <>
          <Param>{algorithm.label || algorithm.id}</Param>
          {algorithm?.parameters?.map((param, i) => (
            <Param key={param.id}>
              {param.label || param.id}: {param.value}
            </Param>
          ))}
        </>
      )}
    </>
  );
};

export default Algorithms;
