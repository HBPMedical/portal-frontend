import { useReactiveVar } from '@apollo/client';
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { APICore, APIMining } from '../API';
import { selectedDomainVar } from '../API/GraphQL/cache';
import { HierarchyCircularNode } from '../API/Model';
import { d3Hierarchy, groupsToTreeView, NodeData } from './d3Hierarchy';
import Explore from './Explore';

const diameter = 800;
const padding = 1.5;

const AlertBox = styled(Alert)`
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
`;

interface Props {
  apiCore: APICore;
  apiMining: APIMining;
}

export default ({ apiCore, apiMining }: Props): JSX.Element => {
  const domain = useReactiveVar(selectedDomainVar);

  // D3Model is used to expose D3 data and interact with the D3 Layout.
  const [d3Layout, setD3Layout] = useState<HierarchyCircularNode>();
  const history = useHistory();

  useEffect(() => {
    if (!domain) return;

    //Build group tree with variables
    const rootNode = groupsToTreeView(
      domain.rootGroup,
      domain.groups,
      domain.variables
    );

    const hierarchyNode = d3Hierarchy(rootNode);

    const bubbleLayout = d3
      .pack<NodeData>()
      .size([diameter, diameter])
      .padding(padding);

    const d3layout = hierarchyNode && bubbleLayout(hierarchyNode);
    setD3Layout(d3layout);
  }, [domain]);

  const handleGoToAnalysis = async (): Promise<void> => {
    history.push(`/analysis`);
  };

  const nextProps = {
    apiCore,
    apiMining,
    handleGoToAnalysis
  };

  return (
    <>
      {apiCore.state.pathologyError && (
        <AlertBox variant="warning">
          <div
            dangerouslySetInnerHTML={{
              __html: `${apiCore.state.pathologyError}`
            }}
          />
        </AlertBox>
      )}

      {d3Layout && <Explore layout={d3Layout} {...nextProps} />}
    </>
  );
};
