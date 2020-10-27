import * as React from 'react';
import { Button, Glyphicon, Panel } from 'react-bootstrap';
import styled from 'styled-components';

import { APICore, APIMining, APIModel } from '../API';
import { VariableEntity } from '../API/Core';
import { D3Model, HierarchyCircularNode, ModelResponse } from '../API/Model';
import { ONTOLOGY_URL } from '../constants';
import AvailableAlgorithms from '../Create/AvailableAlgorithms';
import DropdownModel from '../UI/DropdownModel';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import { ModelType } from './Container';
import Histograms from './D3Histograms';
import ModelView from './D3Model';
import Search from './D3Search';

const DataSelectionBox = styled(Panel.Title)`
  display: flex;
  padding: 0.4em;
  margin-bottom: 4px;
  justify-content: space-between;
  align-items: start;
  background-color: #eee;
`;

const PathologiesBox = styled.div`
  margin-top: 4px;
  font-size: 14px;
  flex: 0 1 1;
`;

const DatasetsBox = styled.div`
  margin-top: 4px;
  font-size: 14px;
  margin-left: 8px;
  flex: 0 1 1;
`;

const Select = styled.select`
  padding: 6px 12px 4px 12px;

  option {
    background-color: white;
  }
`;

const SearchBox = styled.div`
  margin-top: 4px;
  margin-left: 8px;
  flex: 2;
  /* width: 320px; */
`;

const PanelTitle = styled(Panel.Title)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 8px 0 0;
`;

const ModelTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0 8px 0;
  padding: 2px;
  border-bottom: 1px solid lightgray;

  div:first-child {
    flex: 1;
  }

  h5 {
    font-weight: bold;
    margin-right: 8px;
  }
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
`;

const Col2 = styled.div`
  flex: 1;
`;

const Col1 = styled(Col2)`
  margin-right: 8px;
  flex: 1;
`;

export interface ExploreProps {
  apiCore: APICore;
  apiModel: APIModel;
  apiMining: APIMining;
  children?: any;
  selectedNode: HierarchyCircularNode | undefined;
  layout: HierarchyCircularNode;
  histograms?: any;
  d3Model: D3Model;
  handleSelectPathology: (code: string) => void;
  handleSelectNode: (node: HierarchyCircularNode) => void;
  handleUpdateD3Model: (
    model?: ModelType,
    node?: HierarchyCircularNode
  ) => void;
  handleSelectModel: (model?: ModelResponse) => void;
  handleGoToAnalysis: any; // FIXME Promise<void>
  zoom: (circleNode: HierarchyCircularNode) => void;
  setFormulaString: (f: string) => void;
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
    handleSelectPathology,
    handleUpdateD3Model,
    handleSelectModel,
    handleGoToAnalysis,
    zoom
    // setFormulaString
  } = props;

  const model = apiModel.state.model;
  const selectedDatasets = model?.query?.trainingDatasets || [];
  const selectedPathology = model?.query?.pathology || '';
  const datasets = apiCore.state.pathologiesDatasets[selectedPathology];

  const variablesForPathologyDict = apiCore.state.pathologiesVariables;
  const variablesForPathology: VariableEntity[] | undefined =
    (selectedPathology &&
      variablesForPathologyDict &&
      variablesForPathologyDict[selectedPathology]) ||
    undefined;
  const independantsVariables =
    variablesForPathology &&
    variablesForPathology.filter((v: any) => v.isCategorical);

  return (
    <>
      <Grid>
        <Col1>
          <Panel>
            <DataSelectionBox>
              <PathologiesBox>
                {apiCore.state.pathologies &&
                  apiCore.state.pathologies.length > 1 && (
                    <Select
                      className={'btn btn-default'}
                      onChange={(e): void => {
                        handleSelectPathology(e.target.value);
                      }}
                      value={selectedPathology}
                    >
                      {apiCore.state.pathologies.map(g => (
                        <option key={g.code} value={g.code}>
                          {g.label}
                        </option>
                      ))}
                    </Select>
                  )}
              </PathologiesBox>

              <DatasetsBox>
                <LargeDatasetSelect
                  datasets={datasets}
                  handleSelectDataset={apiModel.selectDataset}
                  selectedDatasets={selectedDatasets}
                  isDropdown={true}
                ></LargeDatasetSelect>
              </DatasetsBox>
              <SearchBox>
                <Search
                  hierarchy={layout}
                  zoom={zoom}
                  handleSelectNode={handleSelectNode}
                />
              </SearchBox>
            </DataSelectionBox>
            <Panel.Body style={{ margin: 0, padding: 0 }}>
              {children}
            </Panel.Body>
          </Panel>
        </Col1>
        <Col2>
          <Panel>
            <PanelTitle>
              <h3>{selectedNode && selectedNode.data.label}</h3>

              <div>
                <Button
                  bsStyle="info"
                  type="submit"
                  onClick={handleGoToAnalysis}
                >
                  Descriptive Analysis <Glyphicon glyph="chevron-right" />
                </Button>
              </div>
            </PanelTitle>
          </Panel>
          <Panel>
            <Panel.Body>
              {/* <Tabs defaultActiveKey={0} id="uncontrolled-formula-tabs">
                <Tab eventKey={0} title={'Parameters'} key={0}> */}
              <ModelTitle>
                <h5>Parameters</h5>
                <DropdownModel
                  items={apiModel.state.models}
                  selectedSlug={
                    apiModel.state.model && apiModel.state.model.slug
                  }
                  reset={apiModel.state.model ? true : false}
                  handleSelect={handleSelectModel}
                />
                <div style={{ marginLeft: 'auto' }}>
                  <a
                    href={`${ONTOLOGY_URL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b>Access to the latest ontology and terminology</b>
                  </a>
                </div>
              </ModelTitle>
              <ModelView
                d3Model={d3Model}
                handleUpdateD3Model={handleUpdateD3Model}
                handleSelectNode={handleSelectNode}
                zoom={zoom}
                buttonVariable={
                  <Button
                    className="child"
                    bsStyle={'success'}
                    bsSize={'small'}
                    disabled={
                      !selectedNode || selectedNode.data.code === 'root'
                    }
                    // tslint:disable-next-line jsx-no-lambda
                    onClick={() =>
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
                    AS VARIABLE
                  </Button>
                }
                buttonCovariable={
                  <Button
                    className="child"
                    bsStyle={'warning'}
                    bsSize={'small'}
                    disabled={
                      !selectedNode || selectedNode.data.code === 'root'
                    }
                    // tslint:disable-next-line jsx-no-lambda
                    onClick={() =>
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
                    AS COVARIABLE
                  </Button>
                }
                buttonFilter={
                  <Button
                    className="child"
                    bsStyle={'danger'}
                    bsSize={'small'}
                    disabled={
                      !selectedNode || selectedNode.data.code === 'root'
                    }
                    // tslint:disable-next-line jsx-no-lambda
                    onClick={() =>
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
                    AS FILTER
                  </Button>
                }
              />
              {/* </Tab>
                <Tab eventKey={1} title={'Formula'} key={1}>
                  <Formula
                    parameters={d3Model}
                    handleUpdateD3Model={handleUpdateD3Model}
                    setFormulaString={setFormulaString}
                  />
                </Tab>
              </Tabs> */}
              Available algorithms:{' '}
              <AvailableAlgorithms
                layout={'inline'}
                algorithms={apiCore.state.algorithms}
                lookup={apiCore.lookup}
                apiModel={apiModel}
              />
            </Panel.Body>
          </Panel>

          <Panel className="statistics">
            <Panel.Body>
              <Histograms
                apiMining={apiMining}
                histograms={histograms}
                independantsVariables={independantsVariables}
                selectedNode={selectedNode}
                handleSelectedNode={handleSelectNode}
                zoom={zoom}
                model={model}
              />
            </Panel.Body>
          </Panel>
        </Col2>
      </Grid>
    </>
  );
};
