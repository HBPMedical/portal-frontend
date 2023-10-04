import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import styled from 'styled-components';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar,
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  useCreateExperimentMutation,
  useGetConfigurationQuery,
} from '../API/GraphQL/queries.generated';
import { ResultUnion } from '../API/GraphQL/types.generated';
import ResultDispatcher from '../ExperimentResult/ResultDispatcher';
import Error from '../UI/Error';
import Loader from '../UI/Loader';
import ExperimentSidebar from './ExperimentSidebar';
import ExportDescriptive from './Export/ExportDescriptive';
import FilterFormulaWrapper from './FilterFormulaWrapper';
import Header from './Header';
import { Alert } from '../UI/Alert';

const ExportButton = styled.div`
  float: right;
`;

const Container = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createTransientMutation, { data, loading, error }] =
    useCreateExperimentMutation();
  const [hasVariables, setHasVariables] = useState(false);
  const history = useHistory();
  const results = data?.createExperiment.results as ResultUnion[];
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);
  const { data: configQuery } = useGetConfigurationQuery();
  const hasFilters = configQuery?.configuration.hasFilters ?? true;

  useEffect(() => {
    if (!draftExperiment || draftExperiment.datasets.length === 0) return;

    const hasVars = [
      draftExperiment.coVariables,
      draftExperiment.variables,
    ].some((vars) => vars && vars.length > 0);
    setHasVariables(hasVars);

    if (!hasVars) return;

    const datasets = draftExperiment.datasets;

    createTransientMutation({
      variables: {
        data: {
          name: 'Descriptive analysis',
          datasets: datasets,
          variables: draftExperiment.variables,
          coVariables: draftExperiment.coVariables,
          domain: draftExperiment.domain ?? '',
          filter: draftExperiment.filter,
          algorithm: {
            id: 'descriptive_stats',
            type: 'string',
          },
          transformations: draftExperiment.formula?.transformations?.map(
            (t) => ({
              id: t.id,
              operation: t.operation,
            })
          ),
          interactions: draftExperiment.formula?.interactions,
        },
      },
    });
  }, [createTransientMutation, draftExperiment]);

  const handleCreateExperiment = async (): Promise<void> => {
    history.push(`/experiment`);
  };

  const handleGoBackToExplore = (): void => {
    history.push(`/explore`);
  };

  return (
    <>
      {hasFilters && (
        <div>
          <Sidebar
            sidebar={
              domain ? (
                <FilterFormulaWrapper
                  domain={domain}
                  experiment={draftExperiment}
                />
              ) : (
                <div></div>
              )
            }
            open={sidebarOpen}
            onSetOpen={setSidebarOpen}
            styles={{ sidebar: { background: 'white' } }}
            pullRight
          >
            <div />
          </Sidebar>
        </div>
      )}
      <div className="Model Review">
        <div className="header">
          <Header
            handleGoBackToExplore={handleGoBackToExplore}
            handleCreateExperiment={handleCreateExperiment}
          />
        </div>
        <div className="content">
          <div className="sidebar">
            <ExperimentSidebar
              domain={domain}
              selectedExperiment={selectedExperiment}
              draftExperiment={draftExperiment}
              handleSelectDataset={(id: string): void => {
                localMutations.toggleDatasetExperiment(id);
              }}
            />
          </div>
          <div className="results">
            <Card>
              <Card.Header>
                {hasFilters && (
                  <Button
                    variant="info"
                    id="filters-toggle"
                    onClick={() => setSidebarOpen(true)}
                  >
                    Filters &amp; Formula
                  </Button>
                )}

                {!loading && (
                  <ExportButton>
                    <ExportDescriptive draftExperiment={draftExperiment} />
                  </ExportButton>
                )}
              </Card.Header>
              <Card.Body>
                {!hasVariables && (
                  <Alert
                    message="In order to visualize the descriptive analysis, you must first select some variables"
                    styled="info"
                    title="No variables selected"
                  />
                )}
                {loading && <Loader />}
                {error && <Error message={error.message} />}
                {results?.map((res: ResultUnion, i: number) => {
                  return <ResultDispatcher result={res} key={i} />;
                })}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Container;
