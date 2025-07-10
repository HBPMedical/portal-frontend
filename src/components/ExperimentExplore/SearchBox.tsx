import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsInfoCircle } from 'react-icons/bs';
import styled from 'styled-components';
import { Group, Variable } from '../API/GraphQL/types.generated';

const Shortcuts = styled.div`
  position: relative;

  input {
    margin-right: 16px;
    padding: 0.2rem 0.5rem;
  }

  .form-control {
    font-size: 0.9rem;
  }

  .search-items {
    position: absolute;
    background-color: white;
    padding: 8px;
    border: 1px lightblue solid;
    margin-top: 2px;
    border-radius: 4px;
    cursor: pointer;
    max-height: 80vh;
    overflow: auto;
    width: 100%;
  }

  .search-items li.selected,
  .search-items li:hover {
    border: 1px solid #17a2b8;
  }

  .search-items li {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 2px;
    width: 100%;
    padding: 2px;
    border: 1px solid transparent;
    border-radius: 2px;
  }

  .hidden {
    display: none;
  }
`;

interface Props {
  handleSelectNode: (node: string) => void;
  variables: Variable[];
  groups: Group[];
}

const SearchBox = (props: Props): JSX.Element => {
  const searchRef = useRef<HTMLInputElement>(document.createElement('input'));
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [visibleResults, setVisibleResults] = useState(false);
  const [searchResult, setSearchResult] = useState<string[]>();
  const [keyDownIndex, setKeyDownIndex] = useState(-1);
  const { variables, groups, handleSelectNode } = props;
  const [visibleVars, setVisibleVars] = useState<Variable[]>(variables);
  const [visibleGroups, setVisibleGroups] = useState<Group[]>(groups);

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      setKeyDownIndex((index) => index + 1);
    } else if (event.key === 'ArrowUp') {
      setKeyDownIndex((index) => index - 1);
    } else if (event.key === 'Enter') {
      if (searchResult && searchResult[keyDownIndex])
        handleSelectNode(searchResult[keyDownIndex]);
    } else if (event.key === 'Escape') {
      setVisibleResults(false);
    }
  };

  const handleKeyDownCallback = useCallback(handleKeyDown, [handleKeyDown]);

  useEffect(() => {
    setSearchResult([
      ...visibleVars.map((v) => v.id),
      ...visibleGroups.map((g) => g.id),
    ]);
  }, [visibleVars, visibleGroups]);

  useEffect(() => {
    const delayedFunc = setTimeout(() => {
      if (!searchText) {
        setVisibleGroups(groups);
        setVisibleVars(variables);
        return;
      }

      const query = searchText.toLowerCase();
      setVisibleGroups(
        groups.filter((g) =>
          `${g.id} ${g.label ?? ''}`.toLowerCase().includes(query)
        )
      );

      setVisibleVars(
        variables.filter((v) =>
          `${v.id} ${v.type ?? ''} ${v.label ?? ''}`
            .toLowerCase()
            .includes(query)
        )
      );
    }, 500);

    return (): void => clearTimeout(delayedFunc);
  }, [groups, searchText, variables]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownCallback);

    return function cleanup(): void {
      document.removeEventListener('keydown', handleKeyDownCallback);
    };
  }, [handleKeyDownCallback]);

  useEffect(() => {
    if (!searchResult) {
      return;
    }
    if (keyDownIndex >= searchResult.length) {
      setKeyDownIndex(searchResult.length - 1);
    }

    if (keyDownIndex <= -1) {
      setKeyDownIndex(-1);
    }
  }, [searchResult, keyDownIndex]);

  const handleChangeInput = (
    e: React.SyntheticEvent<HTMLInputElement>
  ): void => {
    const value = e.currentTarget.value;
    if (!value || value.length < 2) {
      setSearchText(undefined);
      return;
    }

    setSearchText(value);
  };

  const handleBlur = (): void => {
    setTimeout(() => setVisibleResults(false), 250);
  };

  return (
    <Shortcuts>
      <input
        placeholder="Search"
        onFocus={(): void => setVisibleResults(searchResult ? true : false)}
        onBlur={handleBlur}
        onChange={handleChangeInput}
        ref={searchRef}
        className={'form-control search-input'}
      />
      <div className={`search-items ${visibleResults ? 'visible' : 'hidden'} `}>
        <Container>
          <Row>
            {visibleVars && (
              <Col>
                <h5>Variables</h5>
                <ul className="list-unstyled">
                  {visibleVars.map((v, i) => (
                    <li
                      className={`${keyDownIndex === i ? 'selected' : ''}`}
                      key={v.id}
                      onClick={(): void => handleSelectNode(v.id)}
                    >
                      <div>{`${v.label ?? v.id}`}</div>
                      {v.type && (
                        <small className="text-muted">
                          <BsInfoCircle /> type: {v.type}
                        </small>
                      )}
                    </li>
                  ))}
                </ul>
              </Col>
            )}

            {visibleGroups && (
              <Col>
                <h5>Groups</h5>
                <ul className="list-unstyled">
                  {visibleGroups.map((g, i) => (
                    <li
                      className={`${
                        keyDownIndex === i + visibleVars.length
                          ? 'selected'
                          : ''
                      }`}
                      key={g.id}
                      onClick={(): void => {
                        handleSelectNode(g.id);
                      }}
                    >
                      {g.label ?? g.id}
                    </li>
                  ))}
                </ul>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </Shortcuts>
  );
};

export default SearchBox;
