import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';

interface Props {
  handleGoBackToExplore: () => void;
  handleCreateExperiment: () => void;
}

const Header = ({ handleCreateExperiment, handleGoBackToExplore }: Props) => {
  return (
    <Card>
      <Card.Body className="experiment-header-body">
        <div className="header-title">
          <Button
            onClick={handleGoBackToExplore}
            variant="outline-primary"
            type="submit"
          >
            <BsFillCaretLeftFill />
          </Button>
          <h1>Descriptive Analysis</h1>
        </div>
        <div className="item">
          <Button
            onClick={handleCreateExperiment}
            variant="primary"
            type="submit"
            id="btn-goto-experiment"
          >
            Create Experiment
            <BsFillCaretRightFill />{' '}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Header;
