import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { GoCheck } from 'react-icons/go';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  useDeleteExperimentMutation,
  useEditExperimentMutation,
} from '../API/GraphQL/queries.generated';
import { Experiment } from '../API/GraphQL/types.generated';
import ExportExperiment from '../UI/Export/ExportExperiment';

dayjs.extend(relativeTime);
dayjs().format();

const InlineDialog = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContainerActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

interface Props {
  experiment?: Experiment;
  handleCopyExperiment: () => void;
}

const Header = ({ experiment, handleCopyExperiment }: Props): JSX.Element => {
  const [confirmDelete, setConfirmDelete] = useState<string | undefined>();

  const [deleteExperimentMutation, delState] = useDeleteExperimentMutation();
  const [editExperimentMutation, editState] = useEditExperimentMutation();
  const id = experiment?.id ?? '';

  const history = useHistory();

  const handleCreateNewExperiment = (): void => {
    handleCopyExperiment();
    history.push(`/review`);
  };

  const handleDeleteExperiment = async (): Promise<void> => {
    if (confirmDelete === undefined) return;
    await deleteExperimentMutation({
      variables: {
        id: confirmDelete,
      },
    });
    if (delState.error === undefined) return history.push('/explore');
    console.log(delState.error);
  };

  const handleShareExperiment = async (): Promise<void> => {
    if (experiment === undefined) return;
    await editExperimentMutation({
      variables: {
        id: id,
        data: {
          shared: !experiment?.shared,
        },
      },
    });
    if (editState.error !== undefined) console.log(editState.error);
  };

  return (
    <Card>
      <Card.Body className="experiment-header-body">
        <div className="item text">
          <h1>
            Results of experiment <strong>{experiment?.name}</strong>
          </h1>
          <p className="item" style={{ fontSize: '1rem', color: '#e1e1e1' }}>
            Created {experiment && dayjs().to(dayjs(experiment?.createdAt))} by{' '}
            {experiment?.author?.fullname ?? experiment?.author?.username}
          </p>
        </div>
        <ContainerActions id="experiment-actions">
          {confirmDelete ? (
            <>
              <InlineDialog>
                <p className="danger" style={{ color: '#e1e1e1' }}>
                  Really delete this experiment?
                </p>
                <div>
                  <Button
                    size={'sm'}
                    variant="danger"
                    onClick={(): void => {
                      handleDeleteExperiment();
                      setConfirmDelete(undefined);
                    }}
                  >
                    <GoCheck />
                  </Button>{' '}
                  <Button
                    size={'sm'}
                    variant="outline-primary"
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
                variant="danger"
                type="submit"
              >
                Delete
              </Button>
            )
          )}

          {experiment && (
            <Button
              variant={experiment?.shared ? 'secondary' : 'primary'}
              onClick={handleShareExperiment}
              style={{ fontSize: '1rem', fontWeight: 'normal' }}
            >
              {experiment?.shared ? 'Unshare' : 'Share'}
            </Button>
          )}

          <Button
            onClick={handleCreateNewExperiment}
            variant="outline-primary"
            type="submit"
          >
            New Experiment from Parameters
          </Button>
          {experiment && <ExportExperiment experiment={experiment} />}
        </ContainerActions>
      </Card.Body>
    </Card>
  );
};

export default Header;
