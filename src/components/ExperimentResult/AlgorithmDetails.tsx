import React from 'react';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
import { useListAlgorithmsQuery } from '../API/GraphQL/queries.generated';
import {
  AlgorithmResult,
  ParamValue,
  PreprocessingParamValue,
} from '../API/GraphQL/types.generated';
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
  result,
}: {
  result?: AlgorithmResult;
}): JSX.Element | null => {
  const { data, loading } = useListAlgorithmsQuery();
  const nameLowerCase = result?.name.toLowerCase();
  const algo = data?.algorithms.find(
    (a) => a.id.toLowerCase() === nameLowerCase
  );

  const params =
    result?.parameters?.map((p) => {
      const label = algo?.parameters?.find((p2) => p2.name === p.name)?.label;
      return {
        id: p.name,
        label: label ?? p.name,
        value: p.value,
      };
    }) ?? [];

  const preprocessingParams = (parameters: PreprocessingParamValue[]) => {
    return parameters.map((p) => {
      if (p.name === 'strategies') {
        return p.values?.map((s) => (
          <Badge variant="info" key={p.name}>
            {s.name}: {s.value ?? 'not defined'}
          </Badge>
        ));
      } else
        return (
          <Badge variant="info" key={p.name}>
            {p.name}: {p.value ?? 'not defined'}
          </Badge>
        );
    });
  };

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
                  {params.map((p) => (
                    <Badge variant="info" key={p.id}>
                      {p.label || p.id}: {p.value ?? 'not defined'}
                    </Badge>
                  ))}
                </ParamContainer>
              )}
              {result?.preprocessing && result?.preprocessing.length > 0 && (
                <ParamContainer>
                  <p>Preprocessing</p>
                  {result?.preprocessing.map((pp) => (
                    <div key={pp.name}>
                      <p>{pp.name}</p>
                      {pp.parameters && preprocessingParams(pp.parameters)}
                    </div>
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
