import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { BsFillCaretRightFill, BsTrash } from 'react-icons/bs';
import styled from 'styled-components';
import { APICore } from '../API';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { VarType } from '../API/GraphQL/operations/mutations/experiments/toggleVarsExperiment';
import { Variable } from '../API/GraphQL/types.generated';
import { ONTOLOGY_URL } from '../constants';
import AvailableAlgorithms from '../ExperimentCreate/AvailableAlgorithms';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import VariablesGroupList from '../UI/Variable/VariablesGroupList';
import { HierarchyCircularNode } from '../utils';
import CirclePack, { GroupVars } from './D3CirclePackLayer';
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
  layout: HierarchyCircularNode;
  handleGoToAnalysis: any; // FIXME Promise<void>
}

export default (props: ExploreProps): JSX.Element => {
  const { apiCore, layout, handleGoToAnalysis } = props;

  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);
  const [selectedGroupVars, setSelectedGroupVars] = useState<GroupVars[]>([]);
  const [selectedNode, setSelectedNode] = useState<
    HierarchyCircularNode | undefined
  >();

  const independantsVariables =
    domain?.variables.filter(v => v.type === 'nominal') ?? [];

  const lookup = (id: string): Variable | undefined => {
    return domain?.variables.find(v => v.id === id);
  };

  useEffect(() => {
    if (!draftExperiment) return;

    const groupVars = [
      ['Filters', draftExperiment.filterVariables, 'slategrey'], // => item[0], item[1], item[2]
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

  return (
    <>
      <Grid>
        <Col1>
          <Card>
            <DataSelection
              hierarchy={layout}
              handleSelectNode={setSelectedNode}
            ></DataSelection>
            <Card.Body style={{ margin: 0, padding: 0 }}>
              <CirclePack
                layout={layout}
                selectedNode={selectedNode}
                groupVars={selectedGroupVars}
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
                lookup={lookup}
                experiment={draftExperiment}
              />
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
