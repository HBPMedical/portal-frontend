import React, { useState } from 'react';
import { Button, Card, FormControl } from 'react-bootstrap';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';

import { Algorithm, Experiment } from '../API/GraphQL/types.generated';

interface Props {
  experiment: Experiment;
  method?: Algorithm;
  handleGoBackToReview: () => void;
  handleRunExperiment: () => void;
  handleNameChange: (name: string) => void;
  isEnabled: boolean;
}

const ExperimentCreateHeader = ({
  experiment,
  method,
  handleGoBackToReview,
  handleRunExperiment,
  handleNameChange,
  isEnabled = true,
}: Props): JSX.Element => {
  const [name, setName] = useState<string>('');

  const handleChangeExperimentName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newName = event.target.value;
    setName(newName);
    handleNameChange(newName);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>): void => {
    const code = event.keyCode || event.charCode;
    if (code === 13) {
      event.preventDefault();
      event.stopPropagation();
      handleRunExperiment();
    }
  };

  const handleSaveAndRun = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    handleRunExperiment();
  };

  return (
    <Card>
      <Card.Body>
        <Button onClick={handleGoBackToReview} variant="info" type="submit">
          <BsFillCaretLeftFill /> Descriptive Analysis
        </Button>
        <h3>Create Experiment</h3>
        <div className="item" style={{ marginRight: '8px' }}>
          <FormControl
            className="item experiment-name"
            type="text"
            placeholder={'Experiment name'}
            value={name}
            onChange={handleChangeExperimentName}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="item">
          <Button
            onClick={handleSaveAndRun}
            title={
              method === undefined || method === null
                ? 'Please choose a method on the right'
                : name === ''
                ? 'Please enter a title for your experiment'
                : experiment.datasets === undefined ||
                  experiment.datasets.length <= 0
                ? 'Please select a dataset'
                : ''
            }
            variant="info"
            type="submit"
            disabled={
              !isEnabled ||
              method === undefined ||
              method === null ||
              name === '' ||
              experiment.datasets === undefined ||
              experiment.datasets.length <= 0
            }
          >
            Run Experiment <BsFillCaretRightFill />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExperimentCreateHeader;
