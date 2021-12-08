import { useReactiveVar } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useRef, useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { selectedExperimentVar } from '../API/GraphQL/cache';
import { experimentUtils } from '../API/GraphQL/operations/utilities';
import {
  useGetExperimentLazyQuery,
  useGetExperimentListLazyQuery
} from '../API/GraphQL/queries.generated';
import { Experiment } from '../API/GraphQL/types.generated';
import Pagination from '../UI/Pagination';
import { useOnClickOutside } from '../utils';
import Loader from './Loader';

dayjs.extend(relativeTime);
dayjs().format();

const DropDownContainer = styled.div`
  flex: 2;
`;

const DropDownHeader = styled.div`
  cursor: pointer;
  color: #007ad9 !important;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
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
  z-index: 100;
`;

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

const ResetItem = styled.div`
  padding: 4px 24px;
  margin-bottom: 4px;
`;

const MessageItem = styled.li`
  list-style: none;
  cursor: pointer;
  padding: 4px 24px;
  margin: 0 0 8px 0;
`;

const SearchContainer = styled.div`
  margin: 1em 1em 8px 1em;
`;

const PaginationContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 1em;
`;

const Search = ({
  searchName,
  setSearchName
}: {
  searchName: string;
  setSearchName: (name: string) => void;
}): JSX.Element => {
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
  experiments
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
          .filter(exp => exp.id !== null)
          .map(experiment => (
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

const Dropdown = (): JSX.Element => {
  const experiment = useReactiveVar(selectedExperimentVar);
  const initialPage = 0;
  const [searchName, setSearchName] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(initialPage);

  const [getExperiment] = useGetExperimentLazyQuery({
    onCompleted: data => {
      experimentUtils.selectExperiment(data.experiment as Experiment);
    }
  });

  const [
    getExperimentList,
    { loading, data }
  ] = useGetExperimentListLazyQuery();

  useEffect(() => {
    getExperimentList();
  }, [getExperimentList]);

  const [isOpen, setIsOpen] = useState(false);
  const node = useRef(null);

  const toggling = (): void => setIsOpen(!isOpen);

  const handleOnClick = (experimentId?: string): void => {
    if (experimentId && experimentId !== '')
      getExperiment({ variables: { id: experimentId } });
    else {
      experimentUtils.selectExperiment(undefined);
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event: Event): void => {
    setIsOpen(false);
  };

  const handleSearchChange = (text: string): void => {
    setSearchName(text);
    setPageNumber(initialPage);
    getExperimentList({ variables: { name: text, page: pageNumber } });
  };

  const handlePageChange = (page: number): void => {
    setPageNumber(page);
    getExperimentList({ variables: { name: searchName, page: page } });
  };

  useOnClickOutside(node, handleClickOutside);

  return (
    <DropDownContainer ref={node}>
      <DropDownHeader onClick={toggling}>
        {experiment ? `from ${experiment.name}` : 'Select Parameters'}
      </DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <SearchContainer>
            <Search
              searchName={searchName}
              setSearchName={handleSearchChange}
            />
          </SearchContainer>
          {loading && <Loader />}
          {!loading && (
            <Items
              experiments={data?.experimentList.experiments ?? []}
              handleOnClick={handleOnClick}
            />
          )}
          <PaginationContainer>
            <Pagination
              totalPages={data?.experimentList.totalPages ?? 0}
              currentPage={pageNumber}
              handleSetCurrentPage={handlePageChange}
            />
          </PaginationContainer>
          <ResetItem>
            <Button
              onClick={(): void => handleOnClick()}
              key={'reset'}
              variant={'light'}
            >
              Reset Parameters
            </Button>
          </ResetItem>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};

export default Dropdown;
