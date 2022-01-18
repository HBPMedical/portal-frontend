import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import { APICore } from '../API';
import {
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useCreateExperimentMutation } from '../API/GraphQL/queries.generated';
import { ResultUnion } from '../API/GraphQL/types.generated';
import ResultDispatcher from '../ExperimentResult/ResultDispatcher';
import Error from '../UI/Error';
import Loader from '../UI/Loader';
import ExperimentSidebar from './ExperimentSidebar';
import Wrapper from './FilterFormulaWrapper';
import Header from './Header';

interface Props extends RouteComponentProps {
  apiCore: APICore;
}

const Container = ({ apiCore, ...props }: Props): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [
    createTransientMutation,
    { data, loading, error }
  ] = useCreateExperimentMutation();

  const { history } = props;
  const results = data?.createExperiment.results as ResultUnion[];
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const selectedExperiment = useReactiveVar(selectedExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);

  useEffect(() => {
    const datasets = draftExperiment.datasets;

    if (datasets && draftExperiment) {
      const variables = [
        ...(draftExperiment.variables ?? []),
        ...(draftExperiment.coVariables ?? [])
      ];

      createTransientMutation({
        variables: {
          data: {
            name: 'Descriptive analysis',
            datasets: datasets,
            variables,
            domain: draftExperiment.domain ?? '',
            filter: draftExperiment.filter,
            algorithm: {
              id: 'DESCRIPTIVE_STATS',
              type: 'string'
            },
            transformations: draftExperiment.formula?.transformations,
            interactions: draftExperiment.formula?.interactions
          }
        }
      });
    }
  }, [createTransientMutation, draftExperiment]);

  const handleCreateExperiment = async (): Promise<void> => {
    history.push(`/experiment`);
  };

  const handleGoBackToExplore = (): void => {
    history.push(`/explore`);
  };

  const makeFilters = (): any => {
    // FIXME: move to Filter, refactor in a pure way
    let fields = [];
    const buildFilter = (code: string): any => {
      if (!domain || !domain.variables) {
        return [];
      }

      const originalVar = domain.variables.find(v => v.id === code);

      if (!originalVar) {
        return [];
      }

      const output: any = {
        id: originalVar.id,
        label: originalVar.label || originalVar.id,
        name: originalVar.id
      };

      if (originalVar && originalVar.enumerations) {
        output.values = originalVar.enumerations.map(c => ({
          [c.id]: c.label || c.id
        }));
        output.input = 'select';
        output.operators = ['equal', 'not_equal', 'in', 'not_in'];
      }

      const type = originalVar && originalVar.type;
      if (type === 'real') {
        output.type = 'double';
        output.input = 'number';
        output.operators = [
          'equal',
          'not_equal',
          'less',
          'greater',
          'between',
          'not_between'
        ];
      }

      if (type === 'integer') {
        output.type = 'integer';
        output.input = 'number';
        output.operators = [
          'equal',
          'not_equal',
          'less',
          'greater',
          'between',
          'not_between'
        ];
      }

      return output;
    };

    const allVariables = draftExperiment.filterVariables || [];

    // add filter variables
    const extractVariablesFromFilter = (filter: any): any =>
      filter.rules.forEach((r: any) => {
        if (r.rules) {
          extractVariablesFromFilter(r);
        }
        if (r.id) {
          allVariables.push(r.id);
        }
      });

    if (draftExperiment && draftExperiment.filter) {
      extractVariablesFromFilter(JSON.parse(draftExperiment.filter));
    }

    const allUniqVariables = Array.from(new Set(allVariables));
    fields =
      (domain?.variables &&
        [...allUniqVariables.map(buildFilter)].filter((f: any) => f.id)) ||
      [];
    const filters =
      (draftExperiment &&
        draftExperiment.filter &&
        JSON.parse(draftExperiment.filter)) ||
      '';

    return { filters, fields };
  };

  const { fields, filters } = makeFilters();

  return (
    <>
      <div>
        <Sidebar
          sidebar={
            domain && (
              <Wrapper
                domain={domain}
                apiCore={apiCore}
                filters={filters}
                fields={fields}
                experiment={draftExperiment}
              />
            )
          }
          open={sidebarOpen}
          onSetOpen={setSidebarOpen}
          styles={{ sidebar: { background: 'white' } }}
          pullRight
        >
          sidebar
        </Sidebar>
      </div>
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
                <Button variant="info" onClick={() => setSidebarOpen(true)}>
                  Filters &amp; Formula
                </Button>
              </Card.Header>
              <Card.Body>
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
