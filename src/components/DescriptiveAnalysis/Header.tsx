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
      <Card.Body>
        <Button onClick={handleGoBackToExplore} variant="info" type="submit">
          <BsFillCaretLeftFill /> Variables
        </Button>
        <h3>Descriptive Analysis</h3>
        <div className="item">
          <Button
            onClick={handleCreateExperiment}
            variant="info"
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
