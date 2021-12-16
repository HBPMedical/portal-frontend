import * as d3 from 'd3';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { HierarchyCircularNode } from '../API/Model';

const Shortcuts = styled.div`
  .d3-link a:after {
    content: ' - ';
  }

  .d3-link a:last-child:after {
    content: '';
  }

  input {
    margin-right: 16px;
    padding: 0.2rem 0.5rem;
  }

  .form-control {
    font-size: 0.9rem;
  }

  .d3-link-results {
    position: absolute;
    background-color: white;
    padding: 8px;
    border: 1px lightblue solid;
    margin: 2px 0 0 -16px;
    border-radius: 4px;
    cursor: pointer;
    max-height: 100vh;
    overflow: auto;
  }

  .d3-link-results a.selected {
    text-decoration: underline;
  }

  .d3-link-results a {
    display: block;
    font-size: 0.9rem;
  }

  .hidden {
    display: none;
  }
`;

interface Props {
  hierarchy: HierarchyCircularNode;
  zoom: (circleNode: HierarchyCircularNode) => void;
  handleSelectNode: (node: HierarchyCircularNode) => void;
}

export default (props: Props): JSX.Element => {
  const resultRef = useRef(null);
  const searchRef = useRef<HTMLInputElement>(document.createElement('input'));
  const [visibleResults, setVisibleResults] = useState(false);
  const [searchResult, setSearchResult] = useState<HierarchyCircularNode[]>();
  const [keyDownIndex, setKeyDownIndex] = useState(0);
  const [enterZoom, setEnterZoom] = useState(false);
  const { hierarchy, zoom, handleSelectNode } = props;

  const handleSelectNodeCallback = useCallback(handleSelectNode, []);
  const zoomCallback = useCallback(zoom, []);

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      setKeyDownIndex(index => index + 1);
    } else if (event.key === 'ArrowUp') {
      setKeyDownIndex(index => index - 1);
    } else if (event.key === 'Enter') {
      setEnterZoom(true);
    } else if (event.key === 'Escape') {
      setVisibleResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return function cleanup(): void {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!searchResult) {
      return;
    }
    if (keyDownIndex >= searchResult.length) {
      setKeyDownIndex(searchResult.length - 1);
    }

    if (keyDownIndex <= 0) {
      setKeyDownIndex(0);
    }
  }, [searchResult, keyDownIndex]);

  useEffect(() => {
    setVisibleResults(searchResult ? true : false);
    const d3results = d3.select(resultRef.current).selectAll('a');
    if (!searchResult) {
      d3results.remove();
      return;
    }

    d3results.remove();
    const d3results2 = d3
      .select(resultRef.current)
      .selectAll('a')
      .data(searchResult)
      .join('a')
      .text(d => `${d.data.label} (${d.data.type || 'group'})`)
      .attr('class', (d, i) => (i === keyDownIndex ? 'selected' : ''))
      .on('click', d => {
        handleSelectNodeCallback(d);
        zoomCallback(d);
        d3.event.stopPropagation();
      });

    if (enterZoom) {
      setEnterZoom(false);
      if (searchRef && searchRef.current) {
        searchRef.current.blur();
      }
      const d3index = d3results2.filter((d, i) => i === keyDownIndex);
      d3index.dispatch('click');
    }
  }, [
    searchResult,
    keyDownIndex,
    handleSelectNodeCallback,
    zoomCallback,
    enterZoom,
    setEnterZoom
  ]);

  const handleChangeInput = (
    e: React.SyntheticEvent<HTMLInputElement>
  ): void => {
    const value = e.currentTarget.value;
    if (!value || value.length < 2) {
      setSearchResult(undefined);

      return;
    }
    const results: HierarchyCircularNode[] = [];
    hierarchy.each(node => {
      const regexp = new RegExp(value, 'ig');
      if (regexp.test(`${node.data.label} ${node.data.type}`)) {
        results.push(node);
      }
    });

    setSearchResult(results.length > 0 ? results : undefined);
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
        className={'form-control'}
      />
      <div
        className={`d3-link-results ${visibleResults ? 'visible' : 'hidden'} `}
        ref={resultRef}
      />
    </Shortcuts>
  );
};
