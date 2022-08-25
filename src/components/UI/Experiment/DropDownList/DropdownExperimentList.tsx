import { useReactiveVar } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { appConfigVar } from '../../../API/GraphQL/cache';
import { localMutations } from '../../../API/GraphQL/operations/mutations';
import {
  useGetExperimentLazyQuery,
  useGetExperimentListLazyQuery
} from '../../../API/GraphQL/queries.generated';
import { Experiment } from '../../../API/GraphQL/types.generated';
import { useOnClickOutside } from '../../../utils';
import Loader from '../../Loader';
import Pagination from '../../Pagination';
import DetailedItemList from './DetailedItemList';
import SimpleItemList from './SimpleItemList';

dayjs.extend(relativeTime);
dayjs().format();

const DropDownContainer = styled.div`
  flex: 2;
`;

const DropDownHeader = styled.div`
  cursor: pointer;

  color: #007ad9;

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

const ResetItem = styled.div`
  padding: 4px 24px;
  margin-bottom: 4px;
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

const DropdownExperimentList = ({
  hasDetailedView = false,
  label = 'Experiment list',
  handleExperimentChanged
}: {
  hasDetailedView: boolean;
  label: string;
  handleExperimentChanged?: (experimentId?: string) => void;
}): JSX.Element => {
  const initialPage = 0;
  const [searchName, setSearchName] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const appConfig = useReactiveVar(appConfigVar);

  const [selectExperiment] = useGetExperimentLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: data => {
      localMutations.selectExperiment(data.experiment as Experiment);
    }
  });

  const [getExperimentList, { loading, data }] = useGetExperimentListLazyQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: parseInt(
      appConfig.experimentsListRefresh ?? `${1000 * 15 * 60}`
    ),
    onCompleted: data => {
      const pages = data.experimentList.totalPages ?? 0;
      if (pageNumber >= pages) setPageNumber(pages - 1);
      if (pages !== totalPages) {
        setTotalPages(pages);
      }
    }
  });

  useEffect(() => {
    getExperimentList();
  }, [getExperimentList]);

  const [isOpen, setIsOpen] = useState(false);
  const node = useRef(null);

  const toggling = (): void => setIsOpen(!isOpen);

  const handleOnClick = (experimentId?: string): void => {
    if (!hasDetailedView) {
      if (experimentId && experimentId !== '') {
        selectExperiment({ variables: { id: experimentId } });
      } else if (experimentId === undefined) {
        localMutations.resetSelectedExperiment();
      }
      handleExperimentChanged?.(experimentId);
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event: Event): void => {
    setIsOpen(false);
  };

  const handleSearchChange = (text: string): void => {
    setSearchName(text);
    setPageNumber(initialPage);
    getExperimentList({ variables: { name: text, page: initialPage } });
  };

  const handlePageChange = (page: number): void => {
    setPageNumber(page);
    getExperimentList({ variables: { name: searchName, page: page } });
  };

  useOnClickOutside(node, handleClickOutside);

  return (
    <DropDownContainer ref={node} className="experiments dropdown-list">
      <DropDownHeader onClick={toggling} className="dropdown-btn">
        {label}
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
            <>
              {!hasDetailedView && (
                <SimpleItemList
                  experiments={data?.experimentList.experiments ?? []}
                  handleOnClick={handleOnClick}
                />
              )}
              {hasDetailedView && (
                <DetailedItemList
                  handleOnClick={handleOnClick}
                  experiments={
                    (data?.experimentList.experiments as Experiment[]) ?? []
                  }
                />
              )}
            </>
          )}
          <PaginationContainer>
            <Pagination
              totalPages={totalPages}
              currentPage={pageNumber}
              handleSetCurrentPage={handlePageChange}
            />
          </PaginationContainer>
          {!hasDetailedView && (
            <ResetItem>
              <Button
                onClick={(): void => handleOnClick()}
                key={'reset'}
                variant={'light'}
              >
                Reset Parameters
              </Button>
            </ResetItem>
          )}
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};

export default DropdownExperimentList;
