import { useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { APICore, APIExperiment, APIModel } from '../API';
import {
  Algorithm,
  AlgorithmParameter,
  AlgorithmParameterRequest
} from '../API/Core';
import { Exareme } from '../API/Exareme';
import { IExperimentPrototype } from '../API/Experiment';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useCreateExperimentMutation } from '../API/GraphQL/queries.generated';
import { Variable } from '../API/GraphQL/types.generated';
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

interface Props extends RouteComponentProps {
  apiExperiment: APIExperiment;
  apiCore: APICore;
  apiModel: APIModel;
}

interface Testing {
  name: string;
  value: string;
}

export const ExperimentCreateContainer = ({
  apiCore,
  apiModel,
  apiExperiment,
  history
}: Props): JSX.Element => {
  const [alert, setAlert] = useState<IAlert | undefined>(undefined);
  const [parameters, setParameters] = useState<AlgorithmParameter[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm | undefined>(undefined);
  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);
  const experiment = useReactiveVar(draftExperimentVar);
  const [createExperiment] = useCreateExperimentMutation({
    onCompleted: data => {
      const id = data.createExperiment.id;
      if (id) {
        history.push(`/experiment/${id}`);
      }
    },
    onError: data => {
      setAlert({
        message: data.message,
        title: 'Error',
        styled: 'error'
      });
    }
  });

  const handleSelectAlgorithm = (algo: Algorithm): void => {
    setAlgorithm(algo);
    setParameters(algo.parameters as AlgorithmParameter[]);
  };

  const lookup = (id: string): Variable | undefined => {
    return domain?.variables.find(v => v.id === id);
  };

  const handleChangeParameters = (parameters: AlgorithmParameter[]): void => {
    setParameters(parameters);
  };

  const handleGoBackToReview = (): void => {
    history.push(`/analysis`);
  };

  const handleRunExperiment = (): void => {
    if (!algorithm || !parameters) {
      setAlert({ message: 'Select an algorithm' });
      return;
    }

    createExperiment({
      variables: {
        isTransient: false,
        data: {
          name: experiment.name,
          datasets: experiment.datasets,
          domain: experiment.domain,
          variables: experiment.variables,
          coVariables: experiment.coVariables,
          filter: experiment.filter,
          interactions: experiment.formula?.interactions,
          transformations: experiment.formula?.transformations,
          algorithm: {
            id: algorithm.name,
            type: algorithm.type,
            parameters:
              (algorithm.parameters as AlgorithmParameterRequest[])
                ?.filter(p => !!p.value)
                .map(p => ({
                  id: p.name,
                  value: p.value
                })) ?? []
          }
        }
      }
    });
  };

  const handleSaveAndRunExperiment = async (name: string): Promise<void> => {
    const model = apiModel.state.model;
    if (!model) {
      setAlert({
        message: 'An error occured, please choose a model',
        styled: 'error',
        title: 'Info'
      });
      return;
    }

    if (!algorithm || !parameters) {
      setAlert({ message: 'Select an algorithm' });
      return;
    }

    const nextParameters = apiExperiment.makeParametersFromModel(
      model,
      parameters
    );

    const tmpexperiment: IExperimentPrototype = {
      algorithm: {
        name: algorithm.name,
        label: algorithm.label,
        parameters: nextParameters,
        type: algorithm.type
      },
      name
    };

    const experiment = Exareme.handleParametersExceptions(tmpexperiment);

    await apiExperiment.create({ experiment, transient: false });
    const { experiment: e } = apiExperiment.state;

    if (e.status === 'error') {
      setAlert({ message: `${e?.result ? e?.result[0].data : ''}` });
      return;
    }

    const uuid = apiExperiment.isExperiment(e)?.uuid;
    if (uuid) {
      history.push(`/experiment/${uuid}`);
    }
  };

  return (
    <div className="Experiment">
      <div className="header">
        <ExperimentCreateHeader
          experiment={experiment}
          method={algorithm}
          handleGoBackToReview={handleGoBackToReview}
          handleRunExperiment={handleRunExperiment}
          handleNameChange={(name: string): void =>
            localMutations.updateDraftExperiment({ name })
          }
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
              {domain && (
                <section>
                  <h4>Domain</h4>
                  <p>{domain.label || domain.id}</p>
                </section>
              )}

              {domain?.datasets && (
                <section>
                  <LargeDatasetSelect
                    datasets={domain?.datasets}
                    selectedDatasets={experiment.datasets}
                    handleSelectDataset={(id: string): void =>
                      localMutations.toggleDatasetExperiment(id)
                    }
                  />
                </section>
              )}

              <section>
                {domain && <Model experiment={experiment} domain={domain} />}
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
                      experiment={experiment}
                      algorithm={algorithm}
                      parameters={parameters}
                      handleChangeParameters={handleChangeParameters}
                      lookup={lookup}
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
                lookup={lookup}
                handleSelectMethod={handleSelectAlgorithm}
                experiment={experiment}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExperimentCreateContainer;
