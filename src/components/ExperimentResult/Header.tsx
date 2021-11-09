import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { GoCheck } from 'react-icons/go';
import { Experiment } from '../API/GraphQL/types.generated';
import { useHistory } from 'react-router-dom';
import { useDeleteExperimentMutation } from '../API/GraphQL/queries.generated';

dayjs.extend(relativeTime);
dayjs().format();

const InlineDialog = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  experiment?: Experiment;
}

const ExperimentResultHeader = ({ experiment }: Props): JSX.Element => {
  const [confirmDelete, setConfirmDelete] = React.useState<
    string | undefined
  >();

  const [
    deleteExperimentMutation,
    { data, loading, error }
  ] = useDeleteExperimentMutation();

  //deleteExperimentMutation({ variables: uuid });

  const history = useHistory();

  const handleCreateNewExperiment = (): void => {
    history.push('/analysis');
  };

  const handleDeleteExperiment = (uuid: string): void => {
    //TODO delete
    history.push('/experiment');
  };

  const handleShareExperiment = (): void => {
    //TODO : share experiment
  };

  return (
    <Card>
      <Card.Body>
        <div className="item text">
          <h3>
            Results of experiment <strong>{experiment?.name}</strong>
          </h3>
          <p className="item">
            Created {experiment && dayjs().to(dayjs(experiment?.createdAt))} by{' '}
            {experiment?.author}
          </p>
        </div>

        {confirmDelete ? (
          <>
            <InlineDialog>
              <p style={{ marginRight: '8px' }} className="danger">
                Really delete this experiment?
              </p>
              <div>
                <Button
                  size={'sm'}
                  variant="primary"
                  onClick={(): void => {
                    handleDeleteExperiment(experiment?.uuid || '');
                    setConfirmDelete(undefined);
                  }}
                >
                  <GoCheck />
                </Button>{' '}
                <Button
                  size={'sm'}
                  variant="outline-dark"
                  style={{ marginRight: '8px' }}
                  onClick={(): void => {
                    setConfirmDelete(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </InlineDialog>
          </>
        ) : (
          experiment && (
            <Button
              onClick={(): void => setConfirmDelete(experiment?.uuid ?? '')}
              style={{ marginRight: '8px' }}
              variant="outline-dark"
              type="submit"
            >
              Delete
            </Button>
          )
        )}

        {experiment && (
          <Button
            variant={experiment?.shared ? 'secondary' : 'info'}
            onClick={handleShareExperiment}
            style={{ marginRight: '8px' }}
          >
            {experiment?.shared ? 'Unshare Experiment' : 'Share Experiment'}
          </Button>
        )}

        <Button
          onClick={handleCreateNewExperiment}
          variant="info"
          type="submit"
        >
          New Experiment from Parameters
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ExperimentResultHeader;
