import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar,
  variablesVar
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  namedOperations,
  useCreateExperimentMutation
} from '../API/GraphQL/queries.generated';
import { Algorithm } from '../API/GraphQL/types.generated';
import { Alert, IAlert } from '../UI/Alert';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import Model from '../UI/Model';
import { Dict } from '../utils';
import AlgorithmParameters from './AlgorithmParameters';
import AvailableAlgorithms from './AvailableAlgorithms';
import ExperimentCreateHeader from './Header';
import Help from './Help';

const Wrapper = styled.div`
  padding: 0 1em;
  min-height: 50vh;
`;

export const ExperimentCreateContainer = (): JSX.Element => {
  const [alert, setAlert] = useState<IAlert | undefined>(undefined);
  const [algorithm, setAlgorithm] = useState<Algorithm | undefined>(undefined);
  const [params, setParams] = useState<Dict>({});
  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);
  const experiment = useReactiveVar(draftExperimentVar);
  const variables = useReactiveVar(variablesVar);
  const history = useHistory();

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

  const handleGoBackToReview = (): void => {
    history.push(`/analysis`);
  };

  useEffect(() => {
    setParams(
      algorithm?.parameters?.reduce(
        (prev, param) => ({
          ...prev,
          [param.name]: param.defaultValue
        }),
        {}
      ) ?? {}
    );
  }, [algorithm]);

  const handleParamChanged = (key: string, value?: string) => {
    setParams(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleRunExperiment = (): void => {
    if (!algorithm) {
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
            ...experiment.algorithm,
            id: experiment.name,
            type: algorithm.type,
            parameters: Object.entries(params)
              .filter(([k, v]) => !!v)
              .map(([k, v]) => ({
                id: k,
                value: v as string
              }))
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
                  handleExperimentChanged={() => setAlgorithm(undefined)}
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
                    <AlgorithmParameters
                      experiment={experiment}
                      algorithm={algorithm}
                      variables={variables}
                      handleParameterChange={handleParamChanged}
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
                experiment={experiment}
                listVariables={variables}
                selectedAlgorithm={algorithm}
                direction="vertical"
                handleSelect={algo => {
                  setAlgorithm(algo);
                  localMutations.updateDraftExperiment({
                    algorithm: {
                      name: algo.id,
                      parameters: []
                    }
                  });
                }}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExperimentCreateContainer;
