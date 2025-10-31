/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReactiveVar } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import {
  BsFillCaretRightFill,
  BsTrash,
  BsFillCaretDownFill,
  BsFillCaretUpFill,
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
  margin: 0 0 16px 0;
  padding: 0 0 8px 0;
  border-bottom: 1px solid lightgray; //line
`;

const ParameterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  h5 {
    padding: 0;
    margin: 0;
  }
`;

const VariableSelectionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 8px 0;
  padding: 16px;
  border-radius: 8px;

  h2 {
    margin: 0;
    font-weight: bold;
    color: white;
    font-family: 'Open Sans Condensed', sans-serif;
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

const CollapsibleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 0;
  user-select: none;

  &:hover {
    color: #2b33e9;
  }

  h2 {
    margin: 0;
    font-weight: bold;
    font-family: 'Open Sans Condensed', sans-serif;
  }
`;

const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
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

  // State for collapsible containers
  const [isParametersOpen, setIsParametersOpen] = useState(true);
  const [isAlgorithmsOpen, setIsAlgorithmsOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(true);

  // Reset selectedNode when domain changes
  useEffect(() => {
    setSelectedNode(undefined);
  }, [domain?.id]);

  const containers = [
    [
      'variable',
      'primary',
      [...(draftExperiment.variables || [])],
      VarType.VARIABLES,
    ],
    [
      'covariate',
      'primary',
      [...(draftExperiment.coVariables || [])],
      VarType.COVARIATES,
    ],
  ];

  if (config?.configuration.hasFilters) {
    containers.push([
      'filter',
      'primary',
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
      <VariableSelectionContainer className="header">
        <h1>Variable selection</h1>
        <Button
          variant="primary"
          type="submit"
          onClick={handleGoToAnalysis}
          id="btn-goto-analysis"
        >
          Descriptive Analysis <BsFillCaretRightFill />
        </Button>
      </VariableSelectionContainer>
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
              <CollapsibleHeader
                onClick={() => setIsParametersOpen(!isParametersOpen)}
              >
                <h2>Parameters</h2>
                {isParametersOpen ? (
                  <BsFillCaretUpFill />
                ) : (
                  <BsFillCaretDownFill />
                )}
              </CollapsibleHeader>
              <CollapsibleContent isOpen={isParametersOpen}>
                <MenuParametersContainer>
                  <ParameterContainer>
                    <DropdownExperimentList
                      hasDetailedView={false}
                      label={
                        selectedExperiment
                          ? `from ${selectedExperiment.name}`
                          : 'Select from a previous experiment'
                      }
                    />
                  </ParameterContainer>
                </MenuParametersContainer>

                <Container id="variable-containers">
                  <Row>
                    {containers.map((bag) => (
                      <Col
                        className={`container-${bag[0]} px-1`}
                        key={bag[0] as string}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <div>
                            <Button
                              className={`child ${bag[0]}`}
                              variant={bag[1] as string}
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
                                  bag[3] as VarType
                                );
                              }}
                            >
                              {bag[2] &&
                              selectedNode &&
                              selectedNode
                                .leaves()
                                .filter((n) => bag[2]?.includes(n.data.id))
                                .length === selectedNode.leaves().length
                                ? '-'
                                : '+'}{' '}
                              {`As ${bag[0]}`}
                              <Badge className="ml-2" variant="secondary">
                                {bag[2].length}
                              </Badge>
                            </Button>
                          </div>

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
                            domain?.variables?.filter((v) =>
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
              </CollapsibleContent>
            </Card.Body>
          </Card>

          <Card style={{ marginBottom: '8px' }}>
            <Card.Body>
              <CollapsibleHeader
                onClick={() => setIsAlgorithmsOpen(!isAlgorithmsOpen)}
              >
                <h2>Available Algorithms</h2>
                {isAlgorithmsOpen ? (
                  <BsFillCaretUpFill />
                ) : (
                  <BsFillCaretDownFill />
                )}
              </CollapsibleHeader>
              <CollapsibleContent isOpen={isAlgorithmsOpen}>
                {localConfig.ontologyUrl && (
                  <p style={{ marginBottom: '16px' }}>
                    <a
                      href={`${localConfig.ontologyUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>Access to the latest ontology and terminology</b>
                    </a>
                  </p>
                )}
                <AvailableAlgorithms
                  direction="horizontal"
                  experiment={draftExperiment}
                  listVariables={variables}
                />
              </CollapsibleContent>
            </Card.Body>
          </Card>

          <Card className="statistics">
            <Card.Body>
              <CollapsibleHeader onClick={() => setIsChartOpen(!isChartOpen)}>
                <h2>Chart</h2>
                {isChartOpen ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
              </CollapsibleHeader>
              <CollapsibleContent isOpen={isChartOpen}>
                <Histograms
                  domain={domain}
                  independantsVariables={independantsVariables}
                  selectedNode={selectedNode}
                  zoom={(node: HierarchyCircularNode): void =>
                    localMutations.setZoomToNode(node.data.id)
                  }
                />
              </CollapsibleContent>
            </Card.Body>
          </Card>
        </Col2>
      </Grid>
    </>
  );
};

export default Explore;
