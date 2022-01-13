import { useReactiveVar } from '@apollo/client';
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { APICore, APIExperiment, APIMining, APIModel, APIUser } from '../API';
import { draftExperimentVar, selectedDomainVar } from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useListDomainsQuery } from '../API/GraphQL/queries.generated';
import { HierarchyCircularNode, ModelResponse } from '../API/Model';
import { AppConfig } from '../App/App';
import CirclePack, { GroupVars } from './D3CirclePackLayer';
import { d3Hierarchy, groupsToTreeView, NodeData } from './d3Hierarchy';

const diameter = 800;
const padding = 1.5;

const AlertBox = styled(Alert)`
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
`;

export enum ModelType {
  COVARIABLE,
  FILTER,
  VARIABLE
}

interface Props extends RouteComponentProps {
  apiCore: APICore;
  apiMining: APIMining;
  apiModel: APIModel;
  apiExperiment: APIExperiment;
  appConfig: AppConfig;
  apiUser: APIUser;
}

export default ({
  apiCore,
  apiMining,
  apiModel,
  apiUser,
  apiExperiment,
  ...props
}: Props): JSX.Element => {
  const [selectedNode, setSelectedNode] = useState<
    HierarchyCircularNode | undefined
  >();

  const domain = useReactiveVar(selectedDomainVar);
  const draftExperiment = useReactiveVar(draftExperimentVar);

  const { data } = useListDomainsQuery({
    onCompleted: data => {
      if (data.domains) {
        localMutations.setDomains(data.domains);
        localMutations.selectDomain(data.domains[0].id);
      }
    }
  });

  // D3Model is used to expose D3 data and interact with the D3 Layout.
  const [d3Layout, setD3Layout] = useState<HierarchyCircularNode>();
  const { history } = props;
  const [selectedGroupVars, setSelectedGroupVars] = useState<GroupVars[]>([]);

  useEffect(() => {
    if (!draftExperiment) return;

    const groupVars = [
      ['Filters', draftExperiment.filterVariables, 'slategrey'],
      ['Variables', draftExperiment.variables, '#5cb85c'],
      ['Covariates', draftExperiment.coVariables, '#f0ad4e']
    ]
      .filter(item => item[1] && item[1].length)
      .map(item => ({
        name: item[0] as string,
        items: item[1] as string[],
        color: item[2] as string
      }));

    setSelectedGroupVars(groupVars);
  }, [draftExperiment]);

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
  }, [data, domain]);

  useEffect(() => {
    if (
      apiUser.state.user &&
      apiUser.state.authenticated &&
      !apiUser.state.user?.agreeNDA
    ) {
      history.push('/tos');
    }
  }, [apiUser.state, history]);

  // Load Histograms for selected variable
  useEffect(() => {
    if (selectedNode && selectedNode.data.isVariable) {
      apiMining.multipleHistograms({
        datasets: draftExperiment.datasets ?? [],
        y: selectedNode.data,
        pathology: draftExperiment.domain || ''
      });
    }
  }, [
    selectedNode,
    apiMining,
    apiMining.state.refetchAlgorithms,
    draftExperiment.datasets,
    draftExperiment.domain
  ]);

  const handleSelectModel = (nextModel?: ModelResponse): void => {
    apiModel.setModel(nextModel);
  };

  const handleGoToAnalysis = async (): Promise<void> => {
    history.push(`/analysis`);
  };

  const nextProps = {
    apiCore,
    apiModel,
    apiMining,
    apiExperiment,
    handleGoToAnalysis,
    handleSelectModel,
    handleSelectNode: setSelectedNode,
    histograms: apiMining.state.histograms,
    selectedNode
  };

  const d3Model = apiModel.state.internalD3Model;

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

      {d3Layout && (
        <CirclePack
          layout={d3Layout}
          d3Model={d3Model}
          groupVars={selectedGroupVars}
          {...nextProps}
        />
      )}
    </>
  );
};
