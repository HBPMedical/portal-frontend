import * as React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

import ResultsErrorBoundary from '../UI/ResultsErrorBoundary';
import RenderResult2 from './RenderResult2';
import { Experiment } from '../API/generated/graphql';
import { ApolloError } from '@apollo/client';

const Body = styled(Card.Body)`
  min-height: 20vh;
  max-width: calc(100vw - 280px);
  }
`;

const LoadingTitle = styled.h5`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const indeterminateAnimation = keyframes`
 from {
      left: -25%;
      width: 25%;
    }
    to {
      left: 100%;
      width: 25%;
    }
`;

const IndederminateProgressBar = styled(ProgressBar)`
  position: relative;
  animation-name: ${indeterminateAnimation};
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const ProgressBarStyled = styled.div`
  width: 360px;
  position: relative;
  overflow-x: hidden;
  border: 1px solid dodgerblue;
  border-radius: 4px;
`;

export default ({
  experiment,
  loading,
  error
}: {
  experiment?: Experiment;
  loading: boolean;
  error?: ApolloError;
}): JSX.Element => {
  return (
    <Card>
      <Body>
        <h4>
          <strong>{experiment?.title}</strong>
        </h4>
        {loading ? (
          <div className="loading">
            <LoadingTitle>Your experiment is currently running</LoadingTitle>
            <ProgressBarStyled>
              <IndederminateProgressBar striped now={100} />
            </ProgressBarStyled>
            <p style={{ marginTop: '16px ' }}>
              Please check back in a moment. This page will automatically
              refresh once your experiment has finished executing.
            </p>
          </div>
        ) : null}
        <ResultsErrorBoundary>
          <RenderResult2 results={experiment?.results} />
        </ResultsErrorBoundary>
      </Body>
    </Card>
  );
};
