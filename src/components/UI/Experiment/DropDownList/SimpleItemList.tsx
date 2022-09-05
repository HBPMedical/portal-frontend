import React from 'react';
import styled from 'styled-components';
import { Experiment } from '../../../API/GraphQL/types.generated';

const DropDownList = styled.ul`
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  list-style: none;
  cursor: pointer;
  padding: 4px 24px;

  &:hover {
    background-color: #007ad9;
    color: white;
  }
`;

const MessageItem = styled.li`
  list-style: none;
  cursor: pointer;
  padding: 4px 24px;
  margin: 0 0 8px 0;
`;

const SimpleItemList = ({
  handleOnClick,
  experiments,
}: {
  handleOnClick: (experimentId?: string) => void;
  experiments: Partial<Experiment>[];
}): JSX.Element => {
  return (
    <>
      <DropDownList>
        {experiments.length === 0 && (
          <MessageItem>There is no result</MessageItem>
        )}
        {experiments
          .filter((exp) => exp.id !== null)
          .map((experiment) => (
            <ListItem
              onClick={(): void => handleOnClick(experiment.id)}
              key={experiment.id}
            >
              {experiment.name}
            </ListItem>
          ))}
      </DropDownList>
    </>
  );
};

export default SimpleItemList;
