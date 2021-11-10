import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import { GoCheck } from 'react-icons/go';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  useDeleteExperimentMutation,
  useEditExperimentMutation
} from '../API/GraphQL/queries.generated';
import { Experiment } from '../API/GraphQL/types.generated';

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

  const [deleteExperimentMutation, delState] = useDeleteExperimentMutation();
  const [editExperimentMutation, editState] = useEditExperimentMutation();
  const id = experiment?.id ?? '';

  const history = useHistory();

  const handleCreateNewExperiment = (): void => {
    history.push(`/review`);
  };

  const handleDeleteExperiment = async (): Promise<void> => {
    if (confirmDelete === undefined) return;
    await deleteExperimentMutation({
      variables: {
        id: confirmDelete
      }
    });
    if (delState.error === undefined) return history.push('/experiment');
    console.log(delState.error);
  };

  const handleShareExperiment = async (): Promise<void> => {
    if (experiment === undefined) return;
    await editExperimentMutation({
      variables: {
        id: id,
        data: {
          shared: !experiment?.shared
        }
      }
    });
    if (editState.error !== undefined) console.log(editState.error);
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
            {experiment?.createdBy?.fullname}
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
                    handleDeleteExperiment();
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
              onClick={(): void => setConfirmDelete(id)}
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
