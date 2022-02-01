import { useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { APICore } from '../API';
import {
  Algorithm,
  AlgorithmParameter,
  AlgorithmParameterRequest
} from '../API/Core';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  namedOperations,
  useCreateExperimentMutation
} from '../API/GraphQL/queries.generated';
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
  apiCore: APICore;
}

export const ExperimentCreateContainer = ({
  apiCore,
  history
}: Props): JSX.Element => {
  const [alert, setAlert] = useState<IAlert | undefined>(undefined);
  const [parameters, setParameters] = useState<AlgorithmParameter[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm | undefined>(undefined);
  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);
  const experiment = useReactiveVar(draftExperimentVar);
  const [createExperiment] = useCreateExperimentMutation({
    refetchQueries: [namedOperations.Query.getExperimentList],
    onCompleted: data => {
      const id = data.createExperiment.id;
      if (id) {
        history.push(`/experiment/${id}`);
      }
    },
    onError: data => {
      setAlert({
        message: data.message,
        title: 'Error during creation',
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
