import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { BsInfoCircle, BsX } from 'react-icons/bs';
import styled from 'styled-components';
import { Variable } from '../../API/GraphQL/types.generated';

const ListGroupVariables = styled(ListGroup)`
  height: 150px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const ButtonList = styled(Button)`
  text-align: left;
  text-decoration: none;
`;

export default ({
  handleOnItemClick,
  handleOnDeleteItem,
  variables
}: {
  handleOnItemClick: (variableId: string) => void;
  handleOnDeleteItem: (variableId: string) => void;
  variables: Variable[];
}): JSX.Element => {
  return (
    <ListGroupVariables variant="flush">
      {variables.map(v => (
        <ListGroup.Item
          key={v.id}
          className="d-flex justify-content-between align-items-start py-1"
        >
          <div className="d-flex flex-column">
            <div>
              <ButtonList
                onClick={(): void => handleOnItemClick(v.id)}
                variant="link"
                size="sm"
                className="fw-bold px-0 py-0"
              >
                {v.label ?? v.id}
              </ButtonList>
            </div>
            {v.type && (
              <small className="text-muted">
                <BsInfoCircle /> type: {v.type}
              </small>
            )}
          </div>

          <Button
            variant="link"
            size="sm"
            className="mt-1 text-danger"
            onClick={(): void => handleOnDeleteItem(v.id)}
          >
            <BsX />{' '}
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroupVariables>
  );
};
