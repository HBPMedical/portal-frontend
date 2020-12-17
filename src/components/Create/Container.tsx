import * as React from 'react';
import { Card, Tab, Tabs, Dropdown } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { APICore, APIExperiment, APIModel } from '../API';
import {
  Algorithm,
  AlgorithmParameter,
  AlgorithmParameterRequest
} from '../API/Core';
import { ExperimentPayload, IExperiment } from '../API/Experiment';
import { ModelResponse } from '../API/Model';
import { VariableEntity } from '../API/Core';
import { AppConfig } from '../App/App';
import { Alert, IAlert } from '../UI/Alert';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import Model from '../UI/Model';
import AvailableAlgorithms from './AvailableAlgorithms';
import ExperimentCreateHeader from './Header';
import Help from './Help';
import Parameters from './Parameters';
import ExperimentList2 from '../UI/ExperimentList2';

interface Props extends RouteComponentProps<any> {
  apiExperiment: APIExperiment;
  apiCore: APICore;
  apiModel: APIModel;
  appConfig: AppConfig;
}

interface State {
  parameters?: AlgorithmParameter[];
  algorithm?: Algorithm;
  alert: IAlert;
}

class Container extends React.Component<Props, State> {
  state!: State;

  render(): JSX.Element {
    const { apiCore, apiModel, apiExperiment } = this.props;
    const alert = this.state && this.state.alert;
    const query = apiModel.state.model && apiModel.state.model.query;
    const pathology = query?.pathology || '';
    const datasets = apiCore.state.pathologiesDatasets[pathology];

    const handleSelectExperiment = (experiment: IExperiment): void => {
      const parameters = experiment.algorithm.parameters;
      const extract = (field: string): VariableEntity[] | undefined => {
        const p = parameters.find(p => p.name === field)?.value as string;
        const parameter = p
          ? p.split(',').map(m => ({ code: m, label: m }))
          : undefined;

        return parameter;
      };

      const newModel: ModelResponse = {
        query: {
          pathology: parameters.find(p => p.name === 'pathology')
            ?.value as string,
          trainingDatasets: extract('dataset'),
          variables: extract('y'),
          coVariables: extract('x'),
          filters: parameters.find(p => p.name === 'filters')?.value as string
        }
      };
      //handleSelectModel(newModel);
      apiModel.setModel(newModel);
    };

    return (
      <div className="Experiment">
        <div className="header">
          <ExperimentCreateHeader
            model={apiModel.state.model}
            experimentList={apiExperiment.state.experimentList}
            method={this.state && this.state.algorithm}
            handleGoBackToReview={this.handleGoBackToReview}
            handleSelectExperiment={this.handleSelectExperiment}
            handleSaveAndRunExperiment={this.handleSaveAndRunExperiment}
          />
        </div>
        <div className="content">
          <div className="sidebar">
            <Card className="datasets">
              <Card.Body>
                {query?.pathology && (
                  <section>
                    <h4>Pathology</h4>
                    <p>{query?.pathology || ''}</p>
                  </section>
                )}

                {datasets && (
                  <section>
                    <LargeDatasetSelect
                      datasets={datasets}
                      handleSelectDataset={apiModel.selectDataset}
                      selectedDatasets={query?.trainingDatasets || []}
                    ></LargeDatasetSelect>
                  </section>
                )}

                <section>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      id="dropdown-model-experiments"
                    >
                      Select from Experiment
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <ExperimentList2
                        handleSelectExperiment={handleSelectExperiment}
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                  <Model model={apiModel.state.model} lookup={apiCore.lookup} />
                </section>
              </Card.Body>
            </Card>
          </div>
          <div className="parameters">
            <Card>
              <Card.Body>
                {alert && (
                  <Alert
                    message={alert.message}
                    title={alert.title}
                    styled={alert.styled}
                  />
                )}
                <Tabs
                  defaultActiveKey={1}
                  id="uncontrolled-create-experiment-tab"
                >
                  <Tab eventKey={'1'} title="Algorithm">
                    <Parameters
                      algorithm={this.state && this.state.algorithm}
                      parameters={this.state && this.state.parameters}
                      handleChangeParameters={this.handleChangeParameters}
                      query={apiModel.state.model && apiModel.state.model.query}
                      apiCore={apiCore}
                    />
                  </Tab>
                  <Tab eventKey={'2'} title="About running experiments">
                    <Help />
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </div>
          <div className="sidebar2">
            <Card>
              <Card.Body>
                <h4>Available Algorithms</h4>
                <AvailableAlgorithms
                  algorithms={apiCore.state.algorithms}
                  lookup={apiCore.lookup}
                  handleSelectMethod={this.handleSelectAlgorithm}
                  apiModel={apiModel}
                />
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  private handleSelectAlgorithm = (algorithm: Algorithm): void => {
    this.setState({
      algorithm: algorithm,
      parameters: algorithm && (algorithm.parameters as AlgorithmParameter[])
    });
  };

  private handleChangeParameters = (parameters: AlgorithmParameter[]): void => {
    this.setState({ parameters });
  };

  private handleSelectExperiment = async (
    experiment: IExperiment
  ): Promise<void> => {
    const { uuid } = experiment;
    const { apiExperiment, history } = this.props;
    history.push(`/experiment/${uuid}`);

    return await apiExperiment.one({ uuid });
  };

  private handleGoBackToReview = (): void => {
    const { history } = this.props;
    history.push(`/review`);
  };

  private handleSaveAndRunExperiment = async (
    experimentName: string
  ): Promise<void> => {
    const { apiModel, apiExperiment, history } = this.props;

    const model = apiModel.state.model;
    if (!model) {
      this.setState({
        alert: {
          message: 'An error occured, please choose a model',
          styled: 'error',
          title: 'Info'
        }
      });
      return;
    }

    const selectedAlgorithm = this.state && this.state.algorithm;
    const { parameters } = this.state;

    if (!selectedAlgorithm || !parameters) {
      this.setState({ alert: { message: 'Select an algorithm' } });
      return;
    }

    const nextParameters = apiExperiment.makeParameters(
      model,
      selectedAlgorithm,
      parameters
    );

    const experiment: Partial<IExperiment> = {
      algorithm: {
        name: selectedAlgorithm.name,
        parameters: nextParameters,
        type: selectedAlgorithm.type
      },
      name: experimentName
    };

    await apiExperiment.create({ experiment, transient: false });
    const { experiment: e, error } = apiExperiment.state;

    if (error) {
      this.setState({
        alert: {
          message: `${error}`
        }
      });

      return;
    }

    const uuid = (e && e.uuid) || '';
    history.push(`/experiment/${uuid}`);
  };
}

export default withRouter(Container);
