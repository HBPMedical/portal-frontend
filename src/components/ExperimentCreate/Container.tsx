import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar,
  variablesVar,
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  namedOperations,
  useCreateExperimentMutation,
} from '../API/GraphQL/queries.generated';
import { Algorithm } from '../API/GraphQL/types.generated';
import ExperimentSidebar from '../DescriptiveAnalysis/ExperimentSidebar';
import { Alert, IAlert } from '../UI/Alert';
import { Dict } from '../utils';
import AlgorithmParameters from './AlgorithmParameters';
import AvailableAlgorithms from './AvailableAlgorithms';
import ExperimentCreateHeader from './Header';
import AlgorithmPreprocessing from './AlgorithmPreprocessingParameters';

const Wrapper = styled.div`
  padding: 1em 1em;
  min-height: 50vh;
`;

const Header = styled.div`
  margin-bottom: 16px;

  h4 {
    margin-bottom: 4px;
  }
`;

export const ExperimentCreateContainer = (): JSX.Element => {
  const [alert, setAlert] = useState<IAlert | undefined>(undefined);
  const [algorithm, setAlgorithm] = useState<Algorithm | undefined>(undefined);
  const [params, setParams] = useState<Dict>({});
  const [preprocessing, setPreprocessing] = useState<Dict<Dict>>({});
  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);
  const experiment = useReactiveVar(draftExperimentVar);
  const variables = useReactiveVar(variablesVar);
  const history = useHistory();
  const [isFormValidated, setFormValidated] = useState<boolean>(true);

  const [createExperiment] = useCreateExperimentMutation({
    refetchQueries: [namedOperations.Query.getExperimentList],
    onCompleted: (data) => {
      const id = data.createExperiment.id;
      if (id) {
        history.push(`/experiment/${id}`);
      }
    },
    onError: (data) => {
      setAlert({
        message: data.message,
        title: 'Error during creation',
        styled: 'error',
      });
    },
  });

  const handleGoBackToReview = (): void => {
    history.push(`/analysis`);
  };

  useEffect(() => {
    setParams(
      algorithm?.parameters?.reduce(
        (prev, param) => ({
          ...prev,
          [param.name]: param.defaultValue,
        }),
        {}
      ) ?? {}
    );
  }, [algorithm]);

  const handleParamChanged = (key: string, value?: string) => {
    setParams((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handlePreprocessingChanged = (
    name: string,
    key: string,
    value?: string
  ) => {
    setPreprocessing((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [key]: value,
      },
    }));

    console.log(JSON.stringify(preprocessing));
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
            id: algorithm.id,
            type: algorithm.type,
            parameters: Object.entries(params)
              .filter(([k, v]) => !!v)
              .map(([k, v]) => ({
                id: k,
                value: v as string,
              })),
            preprocessing: Object.entries(preprocessing).map(([k, v]) => ({
              name: k,
              parameters: Object.entries(v).map(([w, x]) => ({
                id: w,
                value: x as string,
              })),
            })),
          },
        },
      },
    });
  };

  return (
    <div className="experiment">
      <div className="header">
        <ExperimentCreateHeader
          experiment={experiment}
          method={algorithm}
          handleGoBackToReview={handleGoBackToReview}
          handleRunExperiment={handleRunExperiment}
          handleNameChange={(name: string): void =>
            localMutations.updateDraftExperiment({ name })
          }
          isEnabled={isFormValidated}
        />
      </div>
      <div className="content">
        <div className="sidebar">
          <ExperimentSidebar
            domain={domain}
            selectedExperiment={selectedExperiment}
            draftExperiment={experiment}
            handleSelectExperiment={() => setAlgorithm(undefined)}
            handleSelectDataset={(id: string): void => {
              localMutations.toggleDatasetExperiment(id);
            }}
          />
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
                {!algorithm && (
                  <Header>
                    <h4>
                      <strong>Your algorithm</strong>
                    </h4>
                    <p>
                      Please, select the algorithm to be performed in the
                      &apos;Available Algorithms&apos; panel
                    </p>
                  </Header>
                )}

                {algorithm && (
                  <Header>
                    <h4>
                      <strong>{algorithm.label}</strong>
                    </h4>
                    <p>{algorithm.description}</p>
                  </Header>
                )}

                {domain?.datasets
                  .map((d) => d.isLongitudinal)
                  ?.every((e) => e) &&
                  algorithm?.preprocessing &&
                  algorithm?.preprocessing?.length > 0 && (
                    <>
                      <h5>Preprocessing</h5>
                      <Card>
                        <Card.Body>
                          <AlgorithmPreprocessing
                            experiment={experiment}
                            domain={domain}
                            algorithm={algorithm}
                            variables={variables}
                            handlePreprocessingChanged={
                              handlePreprocessingChanged
                            }
                            handleFormValidationChange={(status) =>
                              setFormValidated(status)
                            }
                          />
                        </Card.Body>
                      </Card>
                    </>
                  )}

                {algorithm && (
                  <>
                    <h5>Parameters</h5>
                    <Card>
                      <Card.Body>
                        <AlgorithmParameters
                          experiment={experiment}
                          algorithm={algorithm}
                          variables={variables}
                          handleParameterChange={handleParamChanged}
                          handleFormValidationChange={(status) =>
                            setFormValidated(status)
                          }
                        />
                      </Card.Body>
                    </Card>
                  </>
                )}
              </Wrapper>
            </Card.Body>
          </Card>
        </div>
        <div className="sidebar2">
          <Card>
            <Card.Body>
              <Card.Title>Available Algorithms</Card.Title>
              <Card.Text>
                <AvailableAlgorithms
                  experiment={experiment}
                  listVariables={variables}
                  selectedAlgorithm={algorithm}
                  direction="vertical"
                  handleSelect={(algo) => {
                    setAlgorithm(algo);
                    localMutations.updateDraftExperiment({
                      algorithm: {
                        name: algo.id,
                        parameters: [],
                      },
                    });
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExperimentCreateContainer;
