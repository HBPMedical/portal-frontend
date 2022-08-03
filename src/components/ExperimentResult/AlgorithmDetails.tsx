import React from 'react';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
import { useListAlgorithmsQuery } from '../API/GraphQL/queries.generated';
import { AlgorithmResult } from '../API/GraphQL/types.generated';
import Loader from '../UI/Loader';

const ParamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-left: 5px;
  align-items: flex-start;

  .badge {
    text-align: left;
    white-space: initial;
    word-break: break-all;
  }
`;

const AlgorithmDetails = ({
  result
}: {
  result?: AlgorithmResult;
}): JSX.Element | null => {
  const { data, loading } = useListAlgorithmsQuery();
  const nameLowerCase = result?.name.toLowerCase();
  const algo = data?.algorithms.find(a => a.id.toLowerCase() === nameLowerCase);

  const params =
    result?.parameters?.map(p => {
      const label = algo?.parameters?.find(p2 => p2.name === p.name)?.label;
      return {
        id: p.name,
        label: label ?? p.name,
        value: p.value
      };
    }) ?? [];
  return (
    <>
      {result && (
        <>
          <h4>Algorithm</h4>
          {loading && <Loader />}
          {!loading && result && (
            <>
              <p>{algo?.label || result.name}</p>
              {params && params.length > 0 && (
                <ParamContainer>
                  {params.map(p => (
                    <Badge variant="info" key={p.id}>
                      {p.label || p.id}: {p.value ?? 'not defined'}
                    </Badge>
                  ))}
                </ParamContainer>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default AlgorithmDetails;
