import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  ExperimentListQueryParameters,
  IExperiment,
  IExperimentList
} from '../API/Experiment';
import { MIN_SEARCH_CHARACTER_NUMBER } from '../constants';
import Pagination from '../UI/Pagination';
import { useKeyPressed, useOnClickOutside } from '../utils';

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

const SearchContainer = styled.div`
  margin: 1rem 0;
`;

const DropDownContainer = styled.div`
  flex: 2;
`;

const DropDownHeader = styled.div`
  cursor: pointer;
  color: white !important;
  margin-right: 16px;

  &:hover {
    color: #ccc !important;
  }

  &:after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: '';
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

const DropDownListContainer = styled.div`
  background-color: #fefefe;
  border: 2px solid #eee;
  border-radius: 0.25rem;
  position: absolute;
  margin-top: 0.4em;
  z-index: 100;
`;

const InlineDialog = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AnimatedItemRow = styled.tr<AnimatedProps>`
  transition: 0.5s;
  transform: ${(prop: any): any =>
    prop.entering &&
    `
       translateX(1000px)
   `};
`;

interface AnimatedProps {
  entering: any;
}

interface Props {
  username?: string;
  experimentList?: IExperimentList;
  handleDelete: (uuid: string) => void;
  handleUpdate: (uuid: string, experiment: Partial<IExperiment>) => void;
  handleQueryParameters: ({ ...params }: ExperimentListQueryParameters) => void;
}

interface InternalProps extends Pick<Props, 'username' | 'handleUpdate'> {
  experiment: IExperiment;
  handleOnClick: (parameterExperiment: IExperiment) => void;
}

interface EditingProps {
  editingExperimentName: null | { uuid: string; name: string };
  setEditingExperimentName: React.Dispatch<
    React.SetStateAction<null | { uuid: string; name: string }>
  >;
}

const ExperimentIcon = ({
  status,
  viewed,
  shared
}: Partial<IExperiment>): JSX.Element => {
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

const InlineNameEdit = ({
  ...props
}: InternalProps &
  Omit<InternalProps, 'experiment'> &
  EditingProps): JSX.Element => {
  const node = useRef(null);

  const {
    editingExperimentName,
    setEditingExperimentName,
    handleUpdate
  } = props;
  const shouldSubmit = useKeyPressed((ev: KeyboardEvent) => ev.key === 'Enter');
  const shouldCancel = useKeyPressed(
    (ev: KeyboardEvent) => ev.key === 'Escape'
  );

  const handleClickOutside = (event: Event): void => {
    setEditingExperimentName(null);
  };

  useOnClickOutside(node, handleClickOutside);

  const submit = useCallback(
    (uuid: string, name: string): void => {
      handleUpdate(uuid, { name });
      setEditingExperimentName(null);
    },
    [handleUpdate, setEditingExperimentName]
  );

  const cancel = useCallback((): void => {
    setEditingExperimentName(null);
  }, [setEditingExperimentName]);

  useEffect(() => {
    if (editingExperimentName) {
      if (shouldSubmit) {
        submit(editingExperimentName.uuid, editingExperimentName.name);
      }
      if (shouldCancel) {
        cancel();
      }
    }
  }, [shouldSubmit, shouldCancel, editingExperimentName, submit, cancel]);

  if (!editingExperimentName) return <p>Something went wrong</p>;

  return (
    <>
      <InlineDialog ref={node}>
        <div>
          <Form.Control
            autoFocus
            placeholder={editingExperimentName?.name}
            value={editingExperimentName?.name}
            onChange={(e): void =>
              setEditingExperimentName({
                uuid: editingExperimentName.uuid,
                name: e.target.value
              })
            }
          />
        </div>
        <div>
          <Button
            size={'sm'}
            variant="primary"
            onClick={(): void => {
              submit(editingExperimentName.uuid, editingExperimentName.name);
            }}
          >
            <GoCheck />
          </Button>{' '}
          <Button
            size={'sm'}
            variant="outline-dark"
            onClick={(): void => {
              cancel();
            }}
          >
            Cancel
          </Button>
        </div>
      </InlineDialog>
    </>
  );
};

const ExperimentRow = ({
  ...props
}: InternalProps & { handleDelete: Props['handleDelete'] }): JSX.Element => {
  const node = useRef(null);
  const [editingExperimentName, setEditingExperimentName] = useState<
    EditingProps['editingExperimentName']
  >(null);
  const [confirmDelete, setConfirmDelete] = useState<null | string>(null);
  const [deleted, setDeleted] = useState<null | string>(null);

  const { experiment, username } = props;
  const isOwner = username === experiment.createdBy?.username;

  const handleClickOutside = (event: Event): void => {
    setConfirmDelete(null);
  };

  useOnClickOutside(node, handleClickOutside);

  const ConfimDeleteContainer = ({
    ...props
  }: {
    handleDelete: Props['handleDelete'];
  }): JSX.Element => (
    <td colSpan={3}>
      <InlineDialog ref={node}>
        <span className="danger">Really delete this experiment?</span>
        <div>
          <Button
            size={'sm'}
            variant="primary"
            onClick={(): void => {
              setTimeout(() => {
                props.handleDelete(experiment.uuid);
                setConfirmDelete(null);
              }, 200);
              setDeleted(experiment.uuid);
            }}
          >
            <GoCheck />
          </Button>{' '}
          <Button
            size={'sm'}
            variant="outline-dark"
            onClick={(): void => {
              setConfirmDelete(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </InlineDialog>
    </td>
  );

  return (
    <Transition timeout={500}>
      <AnimatedItemRow entering={deleted === experiment.uuid}>
        <td className="centered align-middle">
          <ExperimentIcon {...experiment} />
        </td>

        {editingExperimentName?.uuid === experiment.uuid ? (
          <td colSpan={5} className="align-middle">
            <InlineNameEdit
              editingExperimentName={editingExperimentName}
              setEditingExperimentName={setEditingExperimentName}
              {...props}
            />
          </td>
        ) : (
          <>
            <td className="align-middle">
              {isOwner || experiment.shared ? (
                <Link
                  className="experiment-name"
                  to={`/experiment/${experiment.uuid}`}
                  title={`See experiment ${experiment.name}`}
                  onClick={(): void => props.handleOnClick(experiment)}
                >
                  {experiment.name}
                </Link>
              ) : (
                <span>{experiment.name}</span>
              )}
            </td>

            {confirmDelete ? (
              <ConfimDeleteContainer {...props} />
            ) : (
              <>
                <td className="centered align-middle">
                  {dayjs().to(dayjs(experiment.created))}
                </td>
                <td className="centered align-middle">
                  {experiment.createdBy?.fullname}
                </td>
                <td className="centered align-middle">
                  <Button
                    size={'sm'}
                    disabled={!isOwner}
                    variant="light"
                    title="Share with all users"
                    onClick={(): void =>
                      props?.handleUpdate(experiment.uuid, {
                        shared: !experiment.shared
                      })
                    }
                  >
                    <FaShareAlt />
                  </Button>{' '}
                  <Button
                    size={'sm'}
                    disabled={
                      !isOwner ||
                      editingExperimentName?.uuid === experiment.uuid
                    }
                    variant="light"
                    title="Edit name"
                    onClick={(): void => {
                      setEditingExperimentName({
                        uuid: experiment.uuid,
                        name: experiment.name || ''
                      });
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
                      setConfirmDelete(experiment.uuid);
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

const Search = ({
  handleQueryParameters,
  searchName,
  setSearchName
}: {
  handleQueryParameters: Props['handleQueryParameters'];
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
  useEffect(() => {
    if (searchName.length > MIN_SEARCH_CHARACTER_NUMBER - 1) {
      handleQueryParameters({ name: searchName, page: 0 });
    } else {
      handleQueryParameters({ name: '' });
    }
  }, [searchName, handleQueryParameters]);

  return (
    <Form.Control
      autoFocus
      value={searchName}
      placeholder="Search"
      onChange={(e): void => {
        setSearchName(e.target.value);
      }}
    />
  );
};

const Items = ({
  handleOnClick,
  ...props
}: Props & { handleOnClick: InternalProps['handleOnClick'] }): JSX.Element => {
  const { experimentList, handleQueryParameters } = props;
  const [searchName, setSearchName] = useState<string>('');

  return (
    <Wrapper>
      <SearchContainer>
        <Search
          handleQueryParameters={handleQueryParameters}
          searchName={searchName}
          setSearchName={setSearchName}
        />
      </SearchContainer>
      {experimentList && experimentList?.experiments ? (
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
              {experimentList?.experiments?.map(experiment => (
                <ExperimentRow
                  key={experiment.uuid}
                  experiment={experiment}
                  username={props.username}
                  handleUpdate={props.handleUpdate}
                  handleOnClick={handleOnClick}
                  handleDelete={props.handleDelete}
                />
              ))}
            </tbody>
          </Table>
          {experimentList.totalPages > 1 && (
            <Pagination
              totalPages={0}
              currentPage={0}
              handleSetCurrentPage={(page: number): void => {
                console.log('TODO'); /* @TODO change dummy data */
              }}
            />
          )}
        </>
      ) : searchName.length > MIN_SEARCH_CHARACTER_NUMBER - 1 ? (
        <div>Your search didn&apos;t return any results</div>
      ) : (
        <div>You don&apos;t have any experiment yet</div>
      )}
    </Wrapper>
  );
};

const Dropdown = ({ ...props }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef(null);

  const toggling = (): void => setIsOpen(!isOpen);

  const onOptionClicked = (experiment?: IExperiment): void => {
    setIsOpen(false);
  };

  const handleClickOutside = (event: Event): void => {
    setIsOpen(false);
  };

  useOnClickOutside(node, handleClickOutside);

  return (
    <DropDownContainer ref={node}>
      <DropDownHeader onClick={toggling}>My Experiments</DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <Items handleOnClick={onOptionClicked} {...props} />
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};

export default ({ ...props }: Props): JSX.Element => <Dropdown {...props} />;
