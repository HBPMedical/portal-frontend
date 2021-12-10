import { useReactiveVar } from '@apollo/client';
import * as React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { APICore, APIExperiment, APIModel } from '../API';
import { Algorithm, AlgorithmParameter } from '../API/Core';
import { Exareme } from '../API/Exareme';
import { IExperimentPrototype } from '../API/Experiment';
import { selectedExperimentVar } from '../API/GraphQL/cache';
import { Alert, IAlert } from '../UI/Alert';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import Model from '../UI/Model';
import AvailableAlgorithms from './AvailableAlgorithms';
import ExperimentCreateHeader from './Header';
import Help from './Help';
import Parameters from './Parameters';

const Wrapper = styled.div`
  padding: 0 1em;
  min-height: 50vh;
`;

interface Props extends RouteComponentProps<any> {
  apiExperiment: APIExperiment;
  apiCore: APICore;
  apiModel: APIModel;
}

interface State {
  parameters?: AlgorithmParameter[];
  algorithm?: Algorithm;
  alert: IAlert;
}

class Container extends React.Component<Props, State> {
  state!: State;

  render(): JSX.Element {
    const { apiCore, apiModel } = this.props;
    const alert = this.state && this.state.alert;
    const query = apiModel.state.model && apiModel.state.model.query;
    const pathology = query?.pathology || '';
    const datasets = apiCore.state.pathologiesDatasets[pathology];
    const selectedExperiment = useReactiveVar(selectedExperimentVar);

    return (
      <div className="Experiment">
        <div className="header">
          <ExperimentCreateHeader
            model={apiModel.state.model}
            method={this.state && this.state.algorithm}
            handleGoBackToReview={this.handleGoBackToReview}
            handleSaveAndRunExperiment={this.handleSaveAndRunExperiment}
          />
        </div>
        <div className="content">
          <div className="sidebar">
            <Card className="datasets">
              <Card.Body>
                <section>
                  <DropdownExperimentList
                    hasDetailedView={false}
                    label={
                      selectedExperiment
                        ? `from ${selectedExperiment.name}`
                        : 'Select Parameters'
                    }
                  />
                </section>
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
                <Wrapper>
                  <Tabs
                    defaultActiveKey={1}
                    id="uncontrolled-create-experiment-tab"
                  >
                    <Tab eventKey={'1'} title="Algorithm">
                      <Parameters
                        algorithm={this.state && this.state.algorithm}
                        parameters={this.state && this.state.parameters}
                        handleChangeParameters={this.handleChangeParameters}
                        query={
                          apiModel.state.model && apiModel.state.model.query
                        }
                        apiCore={apiCore}
                      />
                    </Tab>
                    <Tab eventKey={'2'} title="About running experiments">
                      <Help />
                    </Tab>
                  </Tabs>
                </Wrapper>
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

  private handleGoBackToReview = (): void => {
    const { history } = this.props;
    history.push(`/analysis`);
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

    const nextParameters = apiExperiment.makeParametersFromModel(
      model,
      parameters
    );

    const tmpexperiment: IExperimentPrototype = {
      algorithm: {
        name: selectedAlgorithm.name,
        label: selectedAlgorithm.label,
        parameters: nextParameters,
        type: selectedAlgorithm.type
      },
      name: experimentName
    };

    const experiment = Exareme.handleParametersExceptions(tmpexperiment);

    await apiExperiment.create({ experiment, transient: false });
    const { experiment: e } = apiExperiment.state;

    if (e.status === 'error') {
      this.setState({
        alert: {
          message: `${e?.result ? e?.result[0].data : ''}`
        }
      });

      return;
    }

    const uuid = apiExperiment.isExperiment(e)?.uuid;
    if (uuid) {
      history.push(`/experiment/${uuid}`);
    }
  };
}

export default withRouter(Container);
