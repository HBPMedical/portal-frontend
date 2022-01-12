import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { BsFillCaretRightFill, BsTrash } from 'react-icons/bs';
import styled from 'styled-components';
import { APICore, APIExperiment, APIMining, APIModel } from '../API';
import { VariableEntity } from '../API/Core';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { VarType } from '../API/GraphQL/operations/mutations/experiments/toggleVarsExperiment';
import { useGetDomainListQuery } from '../API/GraphQL/queries.generated';
import { D3Model, HierarchyCircularNode, ModelResponse } from '../API/Model';
import { ONTOLOGY_URL } from '../constants';
import AvailableAlgorithms from '../ExperimentCreate/AvailableAlgorithms';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import VariablesGroupList from '../UI/Variable/VariablesGroupList';
import Histograms from './D3Histograms';
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
    handleGoToAnalysis,
    zoom
  } = props;

  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);
  const { data: dataDomains } = useGetDomainListQuery();

  const model = apiModel.state.model;
  const selectedPathology = domain?.id;

  const variablesForPathologyDict = apiCore.state.pathologiesVariables;
  const variablesForPathology: VariableEntity[] | undefined =
    (selectedPathology &&
      variablesForPathologyDict &&
      variablesForPathologyDict[selectedPathology]) ||
    undefined;
  const independantsVariables =
    variablesForPathology &&
    variablesForPathology.filter((v: any) => v.type === 'nominal');

  return (
    <>
      <Grid>
        <Col1>
          <Card>
            <DataSelection
              zoom={zoom}
              handleChangeDomain={(d): void => localMutations.selectDomain(d)}
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

              <Container>
                <Row>
                  {[
                    [
                      'As variable',
                      'success',
                      [...(draftExperiment.variables || [])],
                      VarType.VARIABLES
                    ],
                    [
                      'As covariate',
                      'warning',
                      [...(draftExperiment.coVariables || [])],
                      VarType.COVARIATES
                    ],
                    [
                      'As filter',
                      'secondary',
                      [...(draftExperiment.filterVariables || [])],
                      VarType.FILTER
                    ]
                  ].map(bag => (
                    <Col className="px-1" key={bag[0] as string}>
                      <div className="d-flex justify-content-between mb-1">
                        <Button
                          className="child"
                          variant={bag[1] as string}
                          size="sm"
                          disabled={
                            !selectedNode || selectedNode.data.id === 'root'
                          }
                          onClick={(): void => {
                            if (!selectedNode) return;

                            const vars = (selectedNode
                              ?.leaves()
                              .filter(node => node.data.id)
                              .map(node => node.data.id) ?? []) as string[];

                            localMutations.toggleVarsDraftExperiment(
                              vars,
                              bag[3] as VarType
                            );
                          }}
                        >
                          {bag[2] &&
                          selectedNode &&
                          selectedNode
                            .leaves()
                            .filter(n => bag[2]?.includes(n.data.id)).length ===
                            selectedNode.leaves().length
                            ? '-'
                            : '+'}{' '}
                          {bag[0]}
                        </Button>

                        {bag[2].length > 0 && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() =>
                              localMutations.toggleVarsDraftExperiment(
                                bag[2] as string[],
                                bag[3] as VarType
                              )
                            }
                          >
                            <BsTrash />{' '}
                          </Button>
                        )}
                      </div>
                      <VariablesGroupList
                        variables={
                          domain?.variables?.filter(v =>
                            bag[2].includes(v.id)
                          ) ?? []
                        }
                        handleOnDeleteItem={(id): void => {
                          localMutations.toggleVarsDraftExperiment(
                            [id],
                            bag[3] as VarType
                          );
                        }}
                        handleOnItemClick={(id): void => {
                          localMutations.setZoomToNode(id);
                        }}
                      ></VariablesGroupList>
                    </Col>
                  ))}
                </Row>
              </Container>
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
