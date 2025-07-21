import { useReactiveVar } from '@apollo/client';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import {
  draftExperimentVar,
  selectedDomainVar,
  visualizationTypeVar,
} from '../API/GraphQL/cache';
import { HierarchyCircularNode } from '../utils';
import CirclePack from './D3CirclePackLayer';
import D3DendrogramLayer from './D3DendrogramLayer';
import {
  d3Hierarchy,
  groupsToTreeView,
  NodeData,
  initializeArrays,
} from './d3Hierarchy';

const diameter = 800;
const padding = 1.5;

export interface Props {
  selectedNode: HierarchyCircularNode | undefined;
  handleSelectNode: (node: HierarchyCircularNode) => void;
}

const SpinnerContainer = styled.div`
  display: flex;
  min-height: inherit;
  justify-content: center;
  align-items: center;
`;

// const EmptyContainer = styled.div`
//   display: flex;
//   min-height: inherit;
//   justify-content: center;
//   align-items: center;
//   background-color: #f8f9fa;
//   border-radius: 4px;
//   color: #6c757d;
//   font-size: 1.1em;
// `;

const D3Container = ({ selectedNode, handleSelectNode }: Props) => {
  const domain = useReactiveVar(selectedDomainVar);
  const draftExp = useReactiveVar(draftExperimentVar);
  const datasets = draftExp?.datasets;
  const visualizationType = useReactiveVar(visualizationTypeVar);

  const [d3Layout, setD3Layout] = useState<HierarchyCircularNode>();

  useEffect(() => {
    if (!domain) return;

    //initialized the arrays in d3Hierarchy (list of available groups and variables)
    initializeArrays();

    const rootNode = groupsToTreeView(
      domain.rootGroup,
      domain.groups,
      domain.variables,
      datasets
    );
    const hierarchyNode = d3Hierarchy(rootNode);
    const bubbleLayout = d3
      .pack<NodeData>()
      .size([diameter, diameter])
      .padding((d) => {
        if (d.depth === 0) {
          return 4;
        } else {
          return 3;
        }
      });

    const layout = hierarchyNode && bubbleLayout(hierarchyNode);
    //console log to see the sizes of the leaf nodes
    if (layout) {
      const leafNodes = layout.descendants().filter((d) => !d.children);
    }
    setD3Layout(layout);
  }, [domain, datasets]);

  const groupVars = [
    ['Filters', draftExp.filterVariables, '#DBDBDB'], // => item[0], item[1], item[2]
    ['Variables', draftExp.variables, '#BCFFCF'],
    ['Covariates', draftExp.coVariables, '#FDEEC6'],
  ]
    .filter((item) => item[1] && item[1].length)
    .map((item) => ({
      name: item[0] as string,
      items: item[1] as string[],
      color: item[2] as string,
    }));

  if (!d3Layout)
    return (
      <SpinnerContainer>
        <Spinner animation="border" variant="info" />
      </SpinnerContainer>
    );

  if (visualizationType === 'dendrogram') {
    return (
      <D3DendrogramLayer
        layout={d3Layout}
        selectedNode={selectedNode}
        groupVars={groupVars}
        handleSelectNode={handleSelectNode}
      />
    );
  }

  return (
    <CirclePack
      layout={d3Layout}
      selectedNode={selectedNode}
      groupVars={groupVars}
      handleSelectNode={handleSelectNode}
    />
  );
};

export default D3Container;
