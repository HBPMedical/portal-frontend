import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { draftExperimentVar, selectedDomainVar } from '../API/GraphQL/cache';
import { HierarchyCircularNode } from '../API/Model';
import CirclePack, { GroupVars } from './D3CirclePackLayer';
import { d3Hierarchy, groupsToTreeView, NodeData } from './d3Hierarchy';
import * as d3 from 'd3';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

const diameter = 800;
const padding = 1.5;

export interface Props {
  selectedNode: HierarchyCircularNode | undefined;
  handleSelectNode: (node: HierarchyCircularNode) => void;
  groupVars: GroupVars[];
}

const SpinnerContainer = styled.div`
  display: flex;
  min-height: inherit;
  justify-content: center;
  align-items: center;
`;

export default ({ selectedNode, handleSelectNode, groupVars }: Props) => {
  const domain = useReactiveVar(selectedDomainVar);
  const datasets = useReactiveVar(draftExperimentVar)?.datasets;
  const [d3Layout, setD3Layout] = useState<HierarchyCircularNode>();

  useEffect(() => {
    if (!domain) return;

    //Build group tree with variables
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
      .padding(padding);

    const d3layout = hierarchyNode && bubbleLayout(hierarchyNode);
    setD3Layout(d3layout);
  }, [domain, datasets]);

  if (!d3Layout)
    return (
      <SpinnerContainer>
        <Spinner animation="border" variant="info" />
      </SpinnerContainer>
    );

  return (
    <CirclePack
      layout={d3Layout}
      selectedNode={selectedNode}
      groupVars={groupVars}
      handleSelectNode={handleSelectNode}
    />
  );
};
