import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import { APICore, APIExperiment, APIModel } from '../API';
import { draftExperimentVar, selectedDomainVar } from '../API/GraphQL/cache';
import { useCreateExperimentMutation } from '../API/GraphQL/queries.generated';
import { ResultUnion } from '../API/GraphQL/types.generated';
import { IFormula } from '../API/Model';
import ResultDispatcher from '../ExperimentResult/ResultDispatcher';
import Error from '../UI/Error';
import Loader from '../UI/Loader';
import ExperimentSidebar from './ExperimentSidebar';
import Wrapper from './FilterFormulaWrapper';
import Header from './Header';

interface Props extends RouteComponentProps {
  apiModel: APIModel;
  apiCore: APICore;
  apiExperiment: APIExperiment;
}

const Container = ({
  apiModel,
  apiCore,
  apiExperiment,
  ...props
}: Props): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [
    createTransientMutation,
    { data, loading, error }
  ] = useCreateExperimentMutation();

  const { history } = props;
  const model = apiModel.state.model;
  const query = model?.query;
  const queryfilters = query?.filters;
  const pathology = query?.pathology || '';
  const datasets = apiCore.state.pathologiesDatasets[pathology];
  const results = data?.createExperiment.results as ResultUnion[];
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const domain = useReactiveVar(selectedDomainVar);

  useEffect(() => {
    const query = apiModel?.state?.model?.query;
    const datasets = draftExperiment.datasets;

    if (datasets && query) {
      const formula = query?.formula;

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
            transformations: formula?.transformations,
            interactions: formula?.interactions
          }
        }
      });
    }
  }, [
    apiModel.state.model,
    queryfilters,
    createTransientMutation,
    apiModel,
    draftExperiment.datasets,
    draftExperiment.domain,
    draftExperiment.filter,
    draftExperiment.variables,
    draftExperiment.coVariables
  ]);

  const handleCreateExperiment = async (): Promise<void> => {
    const model = apiModel.state.model;
    if (model) {
      history.push(`/experiment`);
    }
  };

  const handleGoBackToExplore = (): void => {
    history.push(`/explore`);
  };

  const handleUpdateFilter = async (filters: string): Promise<void> => {
    const model = apiModel.state.model;
    if (model) {
      model.query.filters = (filters && JSON.stringify(filters)) || '';
      await apiModel.setModel(model);
    }
  };

  const handleUpdateFormula = async (formula?: IFormula): Promise<void> => {
    if (draftExperiment) {
      draftExperiment.formula = formula;
      await apiModel.setModel(model);
    }
  };

  const makeFilters = ({ apiCore }: { apiCore: APICore }): any => {
    const variablesForPathology = apiCore.state.pathologiesVariables;
    const pathology = domain?.id;
    const variables =
      pathology && variablesForPathology && variablesForPathology[pathology];

    // FIXME: move to Filter, refactor in a pure way
    let fields: any[] = [];
    const buildFilter = (code: string) => {
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
        output.values = originalVar.enumerations.map((c: any) => ({
          [c.code]: c.label || c.code
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
    const extractVariablesFromFilter = (filter: any) =>
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
      (variables &&
        [...allUniqVariables.map(buildFilter)].filter((f: any) => f.id)) ||
      [];
    const filters =
      (draftExperiment &&
        draftExperiment.filter &&
        JSON.parse(draftExperiment.filter)) ||
      '';

    return { query, filters, fields };
  };

  const { fields, filters } = makeFilters({ apiCore });

  return (
    <>
      <div>
        <Sidebar
          sidebar={
            <Wrapper
              filters={filters}
              fields={fields}
              handleUpdateFilter={handleUpdateFilter}
              handleUpdateFormula={handleUpdateFormula}
              query={query}
              lookup={apiCore.lookup}
              apiCore={apiCore}
            />
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
              apiExperiment={apiExperiment}
              apiModel={apiModel}
              apiCore={apiCore}
              model={model}
              datasets={datasets}
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
