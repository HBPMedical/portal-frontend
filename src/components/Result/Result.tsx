import * as React from 'react';
import { Panel, ProgressBar } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

import { Result, State } from '../API/Experiment';
import ResultsErrorBoundary from '../UI/ResultsErrorBoundary';
import RenderResult from './RenderResult';

const Body = styled(Panel.Body)`
  padding: 0 16px;
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

export default ({
  experimentState
}: {
  experimentState: State;
}): JSX.Element => {
  const experiment = experimentState && experimentState.experiment;
  const results = experiment && experiment.results;
  const error =
    (experimentState && experimentState.error) ||
    (experiment && experiment.error);
  const loading = !results && !error;
  const algorithms = experiment && experiment.algorithms;
  const algorithmName =
    (algorithms &&
      algorithms.length > 0 &&
      (algorithms[0].label || algorithms[0].name)) ||
    '';

  return (
    <Panel>
      <Panel.Title>
        <h3>{algorithmName}</h3>
      </Panel.Title>
      <Body>
        {loading ? (
          <div className="loading">
            <h3>Your experiment is currently running</h3>
            <div style={{ position: 'relative', overflowX: 'hidden' }}>
              <IndederminateProgressBar striped now={100} />
            </div>
            <p>
              Please check back in a few minutes. This page will automatically
              refresh once your experiment has finished executing.
            </p>
          </div>
        ) : null}
        {error ? (
          <div className="error">
            <h3>An error has occured</h3>
            <p>{error}</p>
          </div>
        ) : null}
        <ResultsErrorBoundary>
          <RenderResult results={results as Result[]} />
        </ResultsErrorBoundary>
      </Body>
    </Panel>
  );
};
