import React from 'react';
import { Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { APICore, APIMining } from '../API';
import Explore from './Explore';

const AlertBox = styled(Alert)`
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
`;

interface Props {
  apiCore: APICore;
  apiMining: APIMining;
}

export default ({ apiCore, apiMining }: Props): JSX.Element => {
  const history = useHistory();

  const handleGoToAnalysis = async (): Promise<void> => {
    history.push(`/analysis`);
  };

  const nextProps = {
    apiCore,
    apiMining,
    handleGoToAnalysis
  };

  return (
    <>
      {apiCore.state.pathologyError && (
        <AlertBox variant="warning">
          <div
            dangerouslySetInnerHTML={{
              __html: `${apiCore.state.pathologyError}`
            }}
          />
        </AlertBox>
      )}

      <Explore {...nextProps} />
    </>
  );
};
