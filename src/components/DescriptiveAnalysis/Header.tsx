import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { Experiment } from '../API/GraphQL/types.generated';
import ExportExperiment from '../ExperimentResult/Export/ExportExperiment';

interface Props {
  draftExperiment: Experiment;
  handleGoBackToExplore: () => void;
  handleCreateExperiment: () => void;
}

const Header = ({
  handleCreateExperiment,
  handleGoBackToExplore,
  draftExperiment
}: Props) => {
  const experiment: Experiment = {
    ...draftExperiment,
    name: 'Descriptive analysis',
    createdAt: new Date().getMilliseconds(),
    algorithm: {
      name: 'DESCRIPTIVE_STATS',
      parameters: []
    }
  };
  return (
    <Card>
      <Card.Body>
        <Button onClick={handleGoBackToExplore} variant="info" type="submit">
          <BsFillCaretLeftFill /> Variables
        </Button>
        <h3>Descriptive Analysis</h3>
        <div className="item">
          {experiment && <ExportExperiment experiment={experiment} />}
          <Button onClick={handleCreateExperiment} variant="info" type="submit">
            Create Experiment <BsFillCaretRightFill />{' '}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Header;
