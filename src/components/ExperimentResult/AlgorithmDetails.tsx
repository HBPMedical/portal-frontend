import React from 'react';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
import { useListAlgorithmsQuery } from '../API/GraphQL/queries.generated';
import { AlgorithmResult } from '../API/GraphQL/types.generated';
import Loader from '../UI/Loader';

const Param = styled.p`
  overflow: wrap;
  width: 200px;
  word-wrap: break-word;
  display: inline-block;
  margin-left: 15px;

  &.title {
    font-weight: bold;
  }

  & > .badge {
    text-align: left;
    white-space: normal;
    margin-left: 5px;
  }
`;

const AlgorithmDetails = ({
  result
}: {
  result?: AlgorithmResult;
}): JSX.Element | null => {
  const { data, loading } = useListAlgorithmsQuery();
  const algo = data?.algorithms.find(a => a.id === result?.id);

  const params =
    result?.parameters?.map(p => {
      const label = algo?.parameters?.find(p2 => p2.id === p.id)?.label;
      return {
        id: p.id,
        label: label ?? p.id,
        value: p.value
      };
    }) ?? [];
  return (
    <>
      <h4>Algorithm</h4>
      {loading && <Loader />}
      {!loading && result && algo && (
        <>
          <p>{algo.label || algo.id}</p>
          {params.map((param, i) => {
            return (
              <Param key={param.id}>
                <Badge variant="primary">
                  {param.label || param.id} : {param.value ?? 'not defined'}
                </Badge>
              </Param>
            );
          })}
        </>
      )}
    </>
  );
};

export default AlgorithmDetails;
