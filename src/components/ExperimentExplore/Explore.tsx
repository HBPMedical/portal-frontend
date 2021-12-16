import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { BsFillCaretRightFill } from 'react-icons/bs';
import styled from 'styled-components';
import { APICore, APIExperiment, APIMining, APIModel } from '../API';
import { VariableEntity } from '../API/Core';
import {
  draftExperimentVar,
  selectedExperimentVar
} from '../API/GraphQL/cache';
import { useGetDomainListQuery } from '../API/GraphQL/queries.generated';
import { D3Model, HierarchyCircularNode, ModelResponse } from '../API/Model';
import { ONTOLOGY_URL } from '../constants';
import AvailableAlgorithms from '../ExperimentCreate/AvailableAlgorithms';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import { ModelType } from './Container';
import Histograms from './D3Histograms';
import ModelView from './D3Model';
import DataSelection from './DataSelection';

const MenuParametersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 8px 0;
  padding: 0 0 8px 0;
  border-bottom: 1px solid lightgray;
`;

const ParameterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  h5 {
    padding: 0;
    margin-bottom: 2px;
    font-size: 1.1em;
  }
`;

const AlgorithmTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 0 0;

  h5 {
    padding: 0;
    font-size: 1.1em;
    margin: 0;
  }

  p {
    margin: 0;
    padding: 0;
    color: #666;
    font-size: 0.9em;
  }
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
`;

const Col2 = styled.div`
  flex: 1;
`;

const Col1 = styled(Col2 as any)`
  margin-right: 8px;
  flex: 1;
`;

export interface ExploreProps {
  apiCore: APICore;
  apiModel: APIModel;
  apiMining: APIMining;
  apiExperiment: APIExperiment;
  children?: any;
  selectedNode: HierarchyCircularNode | undefined;
  layout: HierarchyCircularNode;
  histograms?: any;
  d3Model: D3Model;
  handleSelectNode: (node: HierarchyCircularNode) => void;
  handleUpdateD3Model: (
    model?: ModelType,
    node?: HierarchyCircularNode
  ) => void;
  handleSelectModel: (model?: ModelResponse) => void;
  handleGoToAnalysis: any; // FIXME Promise<void>
  zoom: (circleNode: HierarchyCircularNode) => void;
}

export default (props: ExploreProps): JSX.Element => {
  const {
    apiCore,
    apiModel,
    apiMining,
    children,
    layout,
    selectedNode,
    histograms,
    d3Model,
    handleSelectNode,
    handleUpdateD3Model,
    handleGoToAnalysis,
    zoom
  } = props;

  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const { data: dataDomains } = useGetDomainListQuery();

  const model = apiModel.state.model;
  const selectedPathology = draftExperiment.domain;

  const variablesForPathologyDict = apiCore.state.pathologiesVariables;
  const variablesForPathology: VariableEntity[] | undefined =
    (selectedPathology &&
      variablesForPathologyDict &&
      variablesForPathologyDict[selectedPathology]) ||
    undefined;
  const independantsVariables =
    variablesForPathology &&
    variablesForPathology.filter((v: any) => v.type === 'nominal');

  const changeDomain = useCallback(
    (domain: string) => {
      draftExperimentVar({
        ...draftExperiment,
        domain,
        datasets:
          dataDomains?.domains
            .filter(d => d.id === domain)
            .flatMap(d => d.datasets.map(ds => ds.id)) ?? []
      });
    },
    [dataDomains, draftExperiment]
  );

  /**
   * after change on domains or on DraftExperiment we check there is a default domain and dataset
   */
  useEffect(() => {
    if (!draftExperiment.domain && dataDomains?.domains) {
      const domain = dataDomains.domains[0]?.id;
      if (domain) changeDomain(domain);
    }
  }, [changeDomain, dataDomains, draftExperiment]);

  return (
    <>
      <Grid>
        <Col1>
          <Card>
            <DataSelection
              zoom={zoom}
              handleChangeDomain={changeDomain}
              hierarchy={layout}
              handleSelectNode={handleSelectNode}
            ></DataSelection>
            <Card.Body style={{ margin: 0, padding: 0 }}>{children}</Card.Body>
          </Card>
        </Col1>
        <Col2>
          <Card>
            <Card.Body>
              <MenuParametersContainer>
                <ParameterContainer>
                  <h5 style={{ marginRight: '8px' }}>Parameters</h5>
                  <DropdownExperimentList
                    hasDetailedView={false}
                    label={
                      selectedExperiment
                        ? `from ${selectedExperiment.name}`
                        : 'Select Parameters'
                    }
                  />
                </ParameterContainer>
                <div className="item">
                  <Button
                    variant="info"
                    type="submit"
                    onClick={handleGoToAnalysis}
                  >
                    Descriptive Analysis <BsFillCaretRightFill />
                  </Button>
                </div>
              </MenuParametersContainer>

              <ModelView
                d3Model={d3Model}
                handleUpdateD3Model={handleUpdateD3Model}
                handleSelectNode={handleSelectNode}
                zoom={zoom}
                buttonVariable={
                  <Button
                    className="child"
                    variant={'success'}
                    size="sm"
                    disabled={
                      !selectedNode || selectedNode.data.code === 'root'
                    }
                    onClick={(): void =>
                      handleUpdateD3Model(ModelType.VARIABLE, selectedNode)
                    }
                  >
                    {d3Model.variables &&
                    selectedNode &&
                    d3Model.variables.filter(c =>
                      selectedNode.leaves().includes(c)
                    ).length === selectedNode.leaves().length
                      ? '-'
                      : '+'}{' '}
                    As variable
                  </Button>
                }
                buttonCovariable={
                  <Button
                    className="child"
                    variant={'warning'}
                    size="sm"
                    disabled={
                      !selectedNode || selectedNode.data.code === 'root'
                    }
                    onClick={(): void =>
                      handleUpdateD3Model(ModelType.COVARIABLE, selectedNode)
                    }
                  >
                    {d3Model.covariables &&
                    selectedNode &&
                    d3Model.covariables.filter(c =>
                      selectedNode.leaves().includes(c)
                    ).length === selectedNode.leaves().length
                      ? '-'
                      : '+'}{' '}
                    As covariate
                  </Button>
                }
                buttonFilter={
                  <Button
                    className="child"
                    variant={'secondary'}
                    size="sm"
                    disabled={
                      !selectedNode || selectedNode.data.code === 'root'
                    }
                    onClick={(): void =>
                      handleUpdateD3Model(ModelType.FILTER, selectedNode)
                    }
                  >
                    {d3Model.filters &&
                    selectedNode &&
                    d3Model.filters.filter(c =>
                      selectedNode.leaves().includes(c)
                    ).length === selectedNode.leaves().length
                      ? '-'
                      : '+'}{' '}
                    As filter
                  </Button>
                }
              />
              <AlgorithmTitleContainer>
                <p>
                  <strong>Available algorithms</strong>
                </p>
                <p>
                  <a
                    href={`${ONTOLOGY_URL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b>Access to the latest ontology and terminology</b>
                  </a>
                </p>
              </AlgorithmTitleContainer>
              <AvailableAlgorithms
                layout={'inline'}
                algorithms={apiCore.state.algorithms}
                lookup={apiCore.lookup}
                apiModel={apiModel}
              />
            </Card.Body>
          </Card>

          <Card className="statistics">
            <Card.Body>
              <Histograms
                apiMining={apiMining}
                histograms={histograms}
                independantsVariables={independantsVariables}
                selectedNode={selectedNode}
                handleSelectedNode={handleSelectNode}
                zoom={zoom}
                model={model}
              />
            </Card.Body>
          </Card>
        </Col2>
      </Grid>
    </>
  );
};
