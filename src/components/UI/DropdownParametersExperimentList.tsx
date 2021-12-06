import { useReactiveVar } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { APIExperiment } from '../API';
import {
  ExperimentListQueryParameters,
  IExperiment,
  IExperimentList
} from '../API/Experiment';
import { selectedExperimentVar } from '../API/GraphQL/cache';
import { useGetExperimentListLazyQuery } from '../API/GraphQL/queries.generated';
import { MIN_SEARCH_CHARACTER_NUMBER } from '../constants';
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

interface Props {
  apiExperiment: APIExperiment;
  handleSelectExperiment: (experiment?: IExperiment) => void;
}

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
  experimentListForParamters,
  getListForExperimentParameters
}: {
  experimentListForParamters?: IExperimentList;
  getListForExperimentParameters: ({
    ...params
  }: ExperimentListQueryParameters) => Promise<void>;
  handleOnClick: (experimentId?: string) => void;
}): JSX.Element => {
  const [searchName, setSearchName] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(0);

  const [
    getExperimentList,
    { loading, data, error }
  ] = useGetExperimentListLazyQuery();

  useEffect(() => {
    console.log('test');
    getExperimentList({ variables: { name: searchName, page: pageNumber } });
  }, [searchName, pageNumber, getExperimentList]);

  useEffect(() => {
    console.log('data', data?.experimentList);
  }, [data]);

  return (
    <>
      <SearchContainer>
        <Search searchName={searchName} setSearchName={setSearchName} />
      </SearchContainer>
      {loading && <Loader />}
      {!loading && (
        <>
          {!data?.experimentList &&
            searchName.length > MIN_SEARCH_CHARACTER_NUMBER - 1 && (
              <MessageItem>
                Your search didn&apos;t return any results
              </MessageItem>
            )}

          {!data?.experimentList &&
            searchName.length < MIN_SEARCH_CHARACTER_NUMBER && (
              <MessageItem>You don&apos;t have any experiment yet</MessageItem>
            )}
          <DropDownList>
            {data?.experimentList.experiments
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
      )}

      {experimentListForParamters && (
        <PaginationContainer>
          <Pagination
            list={experimentListForParamters}
            query={getListForExperimentParameters}
          />
        </PaginationContainer>
      )}
      <ResetItem>
        <Button
          onClick={(): void => handleOnClick()}
          key={'reset'}
          variant={'light'}
        >
          Reset Parameters
        </Button>
      </ResetItem>
    </>
  );
};

const Dropdown = ({ ...props }: Props): JSX.Element => {
  const { apiExperiment } = props;
  const { state, getListForExperimentParameters } = apiExperiment;
  const { experimentListForParamters } = state;

  const experiment = useReactiveVar(selectedExperimentVar);

  const [isOpen, setIsOpen] = useState(false);
  const node = useRef(null);

  const toggling = (): void => setIsOpen(!isOpen);

  const handleOnClick = (experimentId?: string): void => {
    //props.handleSelectExperiment(experiment); TODO handle selected experiment
    setIsOpen(false);
  };

  const handleClickOutside = (event: Event): void => {
    setIsOpen(false);
  };

  useOnClickOutside(node, handleClickOutside);

  return (
    <DropDownContainer ref={node}>
      <DropDownHeader onClick={toggling}>
        {experiment ? `from ${experiment.name}` : 'Select Parameters'}
      </DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <Items
            handleOnClick={handleOnClick}
            {...{ experimentListForParamters, getListForExperimentParameters }}
          />
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};

export default ({ ...props }: Props): JSX.Element => <Dropdown {...props} />;
