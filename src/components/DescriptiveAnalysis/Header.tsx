import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';

interface Props {
  handleGoBackToExplore: () => void;
  handleCreateExperiment: () => void;
}
export default class Header extends React.Component<Props> {
  render(): JSX.Element {
    const { handleGoBackToExplore, handleCreateExperiment } = this.props;

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
            >
              Create Experiment <BsFillCaretRightFill />{' '}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }
}
