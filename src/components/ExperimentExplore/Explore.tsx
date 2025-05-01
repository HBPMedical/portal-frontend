/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import {
  BsFillCaretRightFill,
  BsTrash,
  BsArrowLeftRight,
} from 'react-icons/bs';
import styled from 'styled-components';
import {
  appConfigVar,
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar,
  variablesVar,
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { VarType } from '../API/GraphQL/operations/mutations/experiments/toggleVarsExperiment';
import { useGetConfigurationQuery } from '../API/GraphQL/queries.generated';
import AvailableAlgorithms from '../ExperimentCreate/AvailableAlgorithms';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import VariablesGroupList from '../UI/Variable/VariablesGroupList';
import { HierarchyCircularNode } from '../utils';
import D3Container from './D3Container';
import DataSelection from './DataSelection';
import Histograms from './Histograms';

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

const SwapButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

const SwapButton = styled(Button)`
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
`;

export interface ExploreProps {
  handleGoToAnalysis: any;
}

const Explore = (props: ExploreProps): JSX.Element => {
  const { handleGoToAnalysis } = props;

  const { data: config } = useGetConfigurationQuery();
  const localConfig = useReactiveVar(appConfigVar);
  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const variables = useReactiveVar(variablesVar);
  const domain = useReactiveVar(selectedDomainVar);
  const [selectedNode, setSelectedNode] = useState<
    HierarchyCircularNode | undefined
  >();

  const containers = [
    [
      'variable',
      'success',
      [...(draftExperiment.variables || [])],
      VarType.VARIABLES,
    ],
    [
      'covariate',
      'warning',
      [...(draftExperiment.coVariables || [])],
      VarType.COVARIATES,
    ],
  ];

  if (config?.configuration.hasFilters) {
    containers.push([
      'filter',
      'secondary',
      [...(draftExperiment.filterVariables || [])],
      VarType.FILTER,
    ]);
  }

  const independantsVariables =
    config?.configuration.hasGrouping && domain
      ? domain?.variables.filter((v) => v.type === 'nominal')
      : [];

  return (
    <>
      <Grid>
        <Col1>
          <Card>
            <DataSelection />
            <Card.Body style={{ margin: 0, padding: 0 }}>
              <D3Container
                selectedNode={selectedNode}
                handleSelectNode={setSelectedNode}
              />
            </Card.Body>
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
                        : 'Select from a previous experiment'
                    }
                  />
                </ParameterContainer>
                <div className="item">
                  <Button
                    variant="info"
                    type="submit"
                    onClick={handleGoToAnalysis}
                    id="btn-goto-analysis"
                  >
                    Descriptive Analysis
                    <BsFillCaretRightFill />
                  </Button>
                </div>
              </MenuParametersContainer>

              <Container id="variable-containers">
                <Row>
                  <Col className="container-variable px-1">
                    {/* Variables Container */}
                    <div className="d-flex justify-content-between mb-1">
                      <div>
                        <Button
                          className="child"
                          variant={containers[0][1] as string}
                          size="sm"
                          disabled={
                            !selectedNode || selectedNode.data.id === 'root'
                          }
                          onClick={(): void => {
                            if (!selectedNode) return;
                            const vars =
                              selectedNode
                                ?.leaves()
                                .filter((node) => node.data.id)
                                .map((node) => node.data.id) ?? [];
                            localMutations.toggleVarsDraftExperiment(
                              vars,
                              containers[0][3] as VarType
                            );
                          }}
                        >
                          {containers[0][2] &&
                          selectedNode &&
                          selectedNode
                            .leaves()
                            .filter((n) =>
                              containers[0][2]?.includes(n.data.id)
                            ).length === selectedNode.leaves().length
                            ? '-'
                            : '+'}{' '}
                          {`As ${containers[0][0]}`}
                          <Badge className="ml-2" variant="secondary">
                            {(containers[0][2] as any[]).length}
                          </Badge>
                        </Button>
                      </div>
                      {(containers[0][2] as any[]).length > 0 && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            localMutations.toggleVarsDraftExperiment(
                              containers[0][2] as string[],
                              containers[0][3] as VarType
                            )
                          }
                        >
                          <BsTrash />
                        </Button>
                      )}
                    </div>
                    <VariablesGroupList
                      variables={
                        domain?.variables?.filter((v) =>
                          (containers[0][2] as string[]).includes(v.id)
                        ) ?? []
                      }
                      handleOnDeleteItem={(id): void => {
                        localMutations.toggleVarsDraftExperiment(
                          [id],
                          containers[0][3] as VarType
                        );
                      }}
                      handleOnItemClick={(id): void => {
                        localMutations.setZoomToNode(id);
                      }}
                    />
                  </Col>

                  <SwapButtonContainer>
                    <SwapButton
                      variant="outline-primary"
                      onClick={(): void => {
                        const variables = [
                          ...(draftExperiment.variables || []),
                        ];
                        const covariates = [
                          ...(draftExperiment.coVariables || []),
                        ];

                        // Remove all current variables and covariates
                        if (variables.length) {
                          localMutations.toggleVarsDraftExperiment(
                            variables,
                            VarType.VARIABLES
                          );
                        }
                        if (covariates.length) {
                          localMutations.toggleVarsDraftExperiment(
                            covariates,
                            VarType.COVARIATES
                          );
                        }

                        // Add them back in swapped positions
                        if (covariates.length) {
                          localMutations.toggleVarsDraftExperiment(
                            covariates,
                            VarType.VARIABLES
                          );
                        }
                        if (variables.length) {
                          localMutations.toggleVarsDraftExperiment(
                            variables,
                            VarType.COVARIATES
                          );
                        }
                      }}
                    >
                      <BsArrowLeftRight />
                    </SwapButton>
                  </SwapButtonContainer>

                  <Col className="container-covariate px-1">
                    {/* Covariates Container */}
                    <div className="d-flex justify-content-between mb-1">
                      <div>
                        <Button
                          className="child"
                          variant={containers[1][1] as string}
                          size="sm"
                          disabled={
                            !selectedNode || selectedNode.data.id === 'root'
                          }
                          onClick={(): void => {
                            if (!selectedNode) return;
                            const vars =
                              selectedNode
                                ?.leaves()
                                .filter((node) => node.data.id)
                                .map((node) => node.data.id) ?? [];
                            localMutations.toggleVarsDraftExperiment(
                              vars,
                              containers[1][3] as VarType
                            );
                          }}
                        >
                          {containers[1][2] &&
                          selectedNode &&
                          selectedNode
                            .leaves()
                            .filter((n) =>
                              containers[1][2]?.includes(n.data.id)
                            ).length === selectedNode.leaves().length
                            ? '-'
                            : '+'}{' '}
                          {`As ${containers[1][0]}`}
                          <Badge className="ml-2" variant="secondary">
                            {(containers[1][2] as any[]).length}
                          </Badge>
                        </Button>
                      </div>
                      {(containers[1][2] as any[]).length > 0 && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            localMutations.toggleVarsDraftExperiment(
                              containers[1][2] as string[],
                              containers[1][3] as VarType
                            )
                          }
                        >
                          <BsTrash />
                        </Button>
                      )}
                    </div>
                    <VariablesGroupList
                      variables={
                        domain?.variables?.filter((v) =>
                          (containers[1][2] as string[]).includes(v.id)
                        ) ?? []
                      }
                      handleOnDeleteItem={(id): void => {
                        localMutations.toggleVarsDraftExperiment(
                          [id],
                          containers[1][3] as VarType
                        );
                      }}
                      handleOnItemClick={(id): void => {
                        localMutations.setZoomToNode(id);
                      }}
                    />
                  </Col>

                  {/* Render filter container if hasFilters is true */}
                  {config?.configuration.hasFilters && (
                    <Col className="container-filter px-1">
                      <div className="d-flex justify-content-between mb-1">
                        <div>
                          <Button
                            className="child"
                            variant={containers[2][1] as string}
                            size="sm"
                            disabled={
                              !selectedNode || selectedNode.data.id === 'root'
                            }
                            onClick={(): void => {
                              if (!selectedNode) return;
                              const vars =
                                selectedNode
                                  ?.leaves()
                                  .filter((node) => node.data.id)
                                  .map((node) => node.data.id) ?? [];
                              localMutations.toggleVarsDraftExperiment(
                                vars,
                                containers[2][3] as VarType
                              );
                            }}
                          >
                            {containers[2][2] &&
                            selectedNode &&
                            selectedNode
                              .leaves()
                              .filter((n) =>
                                containers[2][2]?.includes(n.data.id)
                              ).length === selectedNode.leaves().length
                              ? '-'
                              : '+'}{' '}
                            {`As ${containers[2][0]}`}
                            <Badge className="ml-2" variant="secondary">
                              {(containers[2][2] as any[]).length}
                            </Badge>
                          </Button>
                        </div>
                        {(containers[2][2] as any[]).length > 0 && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() =>
                              localMutations.toggleVarsDraftExperiment(
                                containers[2][2] as string[],
                                containers[2][3] as VarType
                              )
                            }
                          >
                            <BsTrash />
                          </Button>
                        )}
                      </div>
                      <VariablesGroupList
                        variables={
                          domain?.variables?.filter((v) =>
                            (containers[2][2] as string[]).includes(v.id)
                          ) ?? []
                        }
                        handleOnDeleteItem={(id): void => {
                          localMutations.toggleVarsDraftExperiment(
                            [id],
                            containers[2][3] as VarType
                          );
                        }}
                        handleOnItemClick={(id): void => {
                          localMutations.setZoomToNode(id);
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </Container>
              <div id="algorithm-available">
                <AlgorithmTitleContainer>
                  <p>
                    <strong>Available algorithms</strong>
                  </p>
                  {localConfig.ontologyUrl && (
                    <p>
                      <a
                        href={`${localConfig.ontologyUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <b>Access to the latest ontology and terminology</b>
                      </a>
                    </p>
                  )}
                </AlgorithmTitleContainer>
                <AvailableAlgorithms
                  direction="horizontal"
                  experiment={draftExperiment}
                  listVariables={variables}
                />
              </div>
            </Card.Body>
          </Card>

          <Card className="statistics">
            <Card.Body>
              <Histograms
                domain={domain}
                independantsVariables={independantsVariables}
                selectedNode={selectedNode}
                zoom={(node: HierarchyCircularNode): void =>
                  localMutations.setZoomToNode(node.data.id)
                }
              />
            </Card.Body>
          </Card>
        </Col2>
      </Grid>
    </>
  );
};

export default Explore;
