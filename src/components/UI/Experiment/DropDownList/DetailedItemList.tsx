import { useReactiveVar } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useRef, useState } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import {
  BsCloudDownload,
  BsFillExclamationCircleFill,
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsFillTrashFill,
  BsPencilSquare,
  BsWatch
} from 'react-icons/bs';
import { FaShareAlt } from 'react-icons/fa';
import { GoCheck } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';
import { userVar } from '../../../API/GraphQL/cache';
import {
  EditExperimentMutationVariables,
  useDeleteExperimentMutation,
  useEditExperimentMutation
} from '../../../API/GraphQL/queries.generated';
import { Experiment } from '../../../API/GraphQL/types.generated';
import { useKeyPressed } from '../../../utils';

dayjs.extend(relativeTime);
dayjs().format();

const Wrapper = styled(Container)`
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  min-width: 600px;
  padding-bottom: 0.25em;

  a:link,
  a:visited {
    color: #007ad9 !important;
  }

  .experiment-name a :hover {
    text-decoration: underline !important;
    color: #0056b3 !important;
  }

  table tr td {
    font-size: 1rem;
  }

  table th {
    font-weight: normal;
  }

  .centered {
    text-align: center;
  }

  .actions {
    width: 140px;
  }
`;

const InlineDialog = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AnimatedItemRow = styled.tr<AnimatedProps>`
  transition: 0.5s;
  transform: ${(prop: AnimatedProps): any =>
    prop.entering &&
    `
      translateX(1000px)
   `};
`;

interface AnimatedProps {
  entering: boolean;
}

const ExperimentIcon = ({
  status,
  viewed,
  shared
}: Partial<Experiment>): JSX.Element => {
  if (status === 'error') {
    return (
      <BsFillExclamationCircleFill
        title="Experiment has errors"
        className="danger"
      />
    );
  }

  if (status === 'pending') {
    return <BsWatch title="pending experiment" className="secondary" />;
  }

  if (shared) {
    return <FaShareAlt title="shared" className="success" />;
  }

  if (viewed) {
    return <BsFillEyeFill title="viewed" className="success" />;
  }

  if (!viewed && status === 'success') {
    return <BsFillEyeSlashFill title="Not viewed" className="info" />;
  }

  return <BsCloudDownload />;
};

const InlineTextEdit = ({
  text,
  handleTextChange,
  handleCancel
}: {
  text: string;
  handleTextChange: (text: string) => void;
  handleCancel?: () => void;
}): JSX.Element => {
  const [textInput, setTextInput] = useState(text);
  const node = useRef(null);

  useKeyPressed('Escape', () => {
    handleCancel?.();
  });

  useKeyPressed('Enter', () => {
    if (textInput) handleTextChange(textInput);
  });

  return (
    <>
      <InlineDialog ref={node}>
        <div>
          <Form.Control
            autoFocus
            placeholder={text}
            value={textInput}
            onChange={(e): void => {
              setTextInput(e.target.value);
            }}
          />
        </div>
        <div>
          <Button
            size={'sm'}
            variant="primary"
            onClick={(): void => handleTextChange(textInput)}
          >
            <GoCheck />
          </Button>{' '}
          <Button size={'sm'} variant="outline-dark" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </InlineDialog>
    </>
  );
};

const ConfimDeleteContainer = ({
  handleActionDelete
}: {
  handleActionDelete: (confirm: boolean) => void;
}): JSX.Element => {
  useKeyPressed('Escape', () => {
    handleActionDelete(false);
  });

  useKeyPressed('Enter', () => {
    handleActionDelete(true);
  });

  return (
    <td colSpan={3}>
      <InlineDialog>
        <p className="danger">Really delete this experiment?</p>
        <div>
          <Button
            size={'sm'}
            variant="primary"
            onClick={(): void => {
              handleActionDelete(true);
            }}
          >
            <GoCheck />
          </Button>{' '}
          <Button
            size={'sm'}
            variant="outline-dark"
            onClick={(): void => {
              handleActionDelete(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </InlineDialog>
    </td>
  );
};

enum RowState {
  DISPLAYING,
  EDITING,
  DELETEING,
  DELETED
}

const ExperimentRow = ({
  experiment,
  handleOnClick
}: {
  experiment: Experiment;
  handleOnClick?: (experimentId?: string) => void;
}): JSX.Element => {
  const [deleteExperimentMutation] = useDeleteExperimentMutation();
  const [editExperimentMutation] = useEditExperimentMutation();
  const [status, setStatus] = useState<RowState>(RowState.DISPLAYING);

  const user = useReactiveVar(userVar);
  const isOwner = user.username !== experiment.author?.username;
  const isEditing = status === RowState.EDITING;
  const isDeleting = status === RowState.DELETEING;
  const isDeleted = status === RowState.DELETED;

  const handleUpdate = async (
    data: EditExperimentMutationVariables['data']
  ): Promise<void> => {
    await editExperimentMutation({
      variables: { id: experiment.id, data }
    });
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteExperimentMutation({
      variables: { id: experiment.id },
      update(cache) {
        // update all experiment list
        const normalizedId = cache.identify({ id, __typename: 'Experiment' });
        cache.evict({ id: normalizedId });
        cache.gc();
      }
    });
  };

  return (
    <Transition timeout={500}>
      <AnimatedItemRow entering={isDeleted}>
        <td className="centered align-middle">
          <ExperimentIcon {...experiment} />
        </td>

        {isEditing ? (
          <td colSpan={5} className="align-middle">
            <InlineTextEdit
              text={experiment.name}
              handleTextChange={(text: string): void => {
                if (text) handleUpdate({ name: text });
                setStatus(RowState.DISPLAYING);
              }}
              handleCancel={(): void => setStatus(RowState.DISPLAYING)}
            />
          </td>
        ) : (
          <>
            <td className="align-middle">
              <Link
                className="experiment-name"
                to={`/experiment/${experiment.id}`}
                title={`See experiment ${experiment.name}`}
                onClick={(): void => handleOnClick?.()}
              >
                {experiment.name}
              </Link>
            </td>

            {isDeleting ? (
              <ConfimDeleteContainer
                handleActionDelete={(confirm: boolean): void => {
                  if (confirm) {
                    handleDelete(experiment.id);
                    setStatus(RowState.DELETED);
                  } else {
                    setStatus(RowState.DISPLAYING);
                  }
                }}
              />
            ) : (
              <>
                <td className="centered align-middle">
                  {dayjs().to(dayjs(experiment.createdAt))}
                </td>
                <td className="centered align-middle">
                  {experiment.author?.username}
                </td>
                <td className="centered align-middle">
                  <Button
                    size={'sm'}
                    disabled={!isOwner}
                    variant={experiment.shared ? 'success' : 'light'}
                    title={
                      experiment.shared
                        ? 'Stop sharing with all users'
                        : 'Share with all users'
                    }
                    onClick={(): void => {
                      handleUpdate({
                        shared: !experiment.shared
                      });
                    }}
                  >
                    <FaShareAlt />
                  </Button>{' '}
                  <Button
                    size={'sm'}
                    disabled={!isOwner}
                    variant="light"
                    title="Edit name"
                    onClick={(): void => {
                      setStatus(RowState.EDITING);
                    }}
                  >
                    <BsPencilSquare />
                  </Button>{' '}
                  <Button
                    size={'sm'}
                    disabled={!isOwner}
                    variant="light"
                    title="Delete"
                    onClick={(): void => {
                      setStatus(RowState.DELETEING);
                    }}
                  >
                    <BsFillTrashFill />
                  </Button>
                </td>
              </>
            )}
          </>
        )}
      </AnimatedItemRow>
    </Transition>
  );
};

export const DetailedItemList = ({
  experiments,
  handleOnClick
}: {
  experiments: Experiment[];
  handleOnClick: (experimentId?: string) => void;
}): JSX.Element => {
  return (
    <Wrapper>
      {experiments ? (
        <>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Created</th>
                <th>Created By</th>
                <th className="actions"></th>
              </tr>
            </thead>
            <tbody>
              {experiments.map(experiment => (
                <ExperimentRow
                  key={experiment.id}
                  experiment={experiment}
                  handleOnClick={handleOnClick}
                />
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <div>You don&apos;t have any experiment yet</div>
      )}
    </Wrapper>
  );
};

export default DetailedItemList;
