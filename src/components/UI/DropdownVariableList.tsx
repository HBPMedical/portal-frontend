import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Variable } from '../API/GraphQL/types.generated';
import { useOnClickOutside } from '../utils';
import Pagination from './Pagination';

const DropDownContainer = styled.div`
  flex: 2;
`;

const DropDownHeader = styled.div`
  cursor: pointer;

  color: #007ad9;

  &:hover {
    color: #0056b3;
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
  z-index: 9999;
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

const DropDownList = styled.ul`
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  list-style: none;
  cursor: pointer;
  padding: 4px 24px;
  text-decoration: none !important;

  &:hover {
    background-color: #007ad9;
    color: white;
    text-decoration: none !important;
  }
`;

const MessageItem = styled.li`
  list-style: none;
  cursor: pointer;
  padding: 4px 24px;
  margin: 0 0 8px 0;
`;

const Search = ({
  searchName,
  setSearchName,
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

type Props = {
  id: string;
  variables: Variable[];
  title: string;
  isTabOpen: boolean;
  handleChooseVariable: (v?: Variable) => void;
  onToggle?: (state: boolean) => void;
  itemPerPage?: number;
};

const DropdownVariableList = ({
  id,
  variables,
  title,
  isTabOpen,
  handleChooseVariable,
  onToggle,
  itemPerPage = 10,
}: Props) => {
  const initialPage = 0;
  const [searchName, setSearchName] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [shownVars, setShownVars] = useState<Variable[]>([]);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(variables.length / itemPerPage)
  );
  const [filteredVariables, setFilteredVariables] =
    useState<Variable[]>(variables);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const node = useRef(null);

  const toggling = (): void => setIsOpen(!isOpen);

  const handleOnClick = (variable?: Variable): void => {
    setIsOpen(false);
    handleChooseVariable(variable);
  };

  const handleClickOutside = (event: Event): void => {
    setIsOpen(false);
  };

  const handleSearchChange = (text: string): void => {
    setSearchName(text);
    setPageNumber(initialPage);
  };

  const handlePageChange = (page: number): void => {
    setPageNumber(page);
  };

  useEffect(() => {
    if (searchName && searchName.trim() !== '') {
      setFilteredVariables(
        variables.filter(
          (v) => v.label?.includes(searchName) || v.id.includes(searchName)
        )
      );
    } else {
      setFilteredVariables(variables);
    }
  }, [variables, searchName]);

  useEffect(() => {
    setShownVars(
      filteredVariables.slice(
        pageNumber * itemPerPage,
        (pageNumber + 1) * itemPerPage
      )
    );
  }, [pageNumber, itemPerPage, filteredVariables]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredVariables.length / itemPerPage));
  }, [filteredVariables, itemPerPage]);

  useEffect(() => {
    onToggle?.(isOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useOnClickOutside(node, handleClickOutside);

  return (
    <DropDownContainer ref={node} className="experiments dropdown-list" id={id}>
      <DropDownHeader onClick={() => toggling()} className="dropdown-btn">
        {title}
      </DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <SearchContainer>
            <Search
              searchName={searchName}
              setSearchName={handleSearchChange}
            />
          </SearchContainer>
          <DropDownList>
            {shownVars.length === 0 && (
              <MessageItem>There is no result</MessageItem>
            )}
            {shownVars
              .filter((variable) => variable.id !== null)
              .map((variable) => (
                <ListItem
                  onClick={(): void => handleOnClick(variable)}
                  key={variable.id}
                >
                  {variable.label}
                </ListItem>
              ))}
          </DropDownList>
          <PaginationContainer>
            <Pagination
              totalPages={totalPages}
              currentPage={pageNumber}
              handleSetCurrentPage={handlePageChange}
            />
          </PaginationContainer>
          <ResetItem>
            <Button
              onClick={() => handleOnClick()}
              key={'reset'}
              size="sm"
              variant={'secondary'}
            >
              Reset
            </Button>
          </ResetItem>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};

export default DropdownVariableList;
