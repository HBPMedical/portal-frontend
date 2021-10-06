import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import { APICore, APIExperiment, APIModel } from '../API';
import { VariableEntity } from '../API/Core';
import {
  GroupsResult,
  useCreateTransientMutation
} from '../API/generated/graphql';
import DescriptiveStatistics from '../UI/Visualization2/DescriptiveStatistics';
import ExperimentSidebar from './ExperimentSidebar';
import Header from './Header';
import Options from './Options';

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
  const [shouldReload, setShouldReload] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [
    createTransientMutation,
    { data, loading, error }
  ] = useCreateTransientMutation();

  const { history } = props;
  const model = apiModel.state.model;
  const trainingDatasets = model?.query.trainingDatasets;
  const queryfilters = model?.query.filters;
  const query = model?.query;
  const pathology = query?.pathology || '';
  const datasets = apiCore.state.pathologiesDatasets[pathology];
  const selectedDatasets = query?.trainingDatasets?.map(d => ({
    ...datasets?.find(v => v.code === d.code),
    ...d
  }));
  console.log(data, loading, error);
  const results = data?.createExperiment.results as GroupsResult[];

  React.useEffect(() => {
    if (!shouldReload) {
      return;
    }

    const query = apiModel?.state?.model?.query;
    const datasets = query?.trainingDatasets;

    if (datasets && query) {
      const variables = [
        ...(query.variables?.map(variable => variable.code) ?? []),
        ...(query.coVariables?.map(variable => variable.code) ?? []),
        ...(query.groupings?.map(variable => variable.code) ?? [])
      ];

      createTransientMutation({
        variables: {
          data: {
            name: 'Descriptive analysis',
            datasets: datasets.map(dataset => dataset.code),
            variables,
            domain: query.pathology ?? '',
            filter: query.filters,
            algorithm: {
              name: 'DESCRIPTIVE_STATS',
              type: 'string'
            }
          }
        }
      });
    }
  }, [
    apiModel.state.model,
    trainingDatasets,
    queryfilters,
    shouldReload,
    createTransientMutation,
    apiModel
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
      setShouldReload(true);
      await apiModel.setModel(model);
    }
  };

  const makeFilters = ({
    apiCore,
    apiModel
  }: {
    apiCore: APICore;
    apiModel: APIModel;
  }): any => {
    const query = apiModel.state.model && apiModel.state.model.query;
    const variablesForPathology = apiCore.state.pathologiesVariables;
    const pathology = query?.pathology;
    const variables =
      pathology && variablesForPathology && variablesForPathology[pathology];

    // FIXME: move to Filter, refactor in a pure way
    let fields: any[] = [];
    const buildFilter = (code: string) => {
      if (!variables) {
        return [];
      }

      const originalVar = variables.find(
        (variable: VariableEntity) => variable.code === code
      );

      if (!originalVar) {
        return [];
      }

      const output: any = {
        id: code,
        label: originalVar.label || originalVar.code,
        name: code
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

    const allVariables = query?.filterVariables?.map(f => f.code) || [];

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

    if (query && query.filters) {
      extractVariablesFromFilter(JSON.parse(query.filters));
    }

    const allUniqVariables = Array.from(new Set(allVariables));
    fields =
      (variables &&
        [...allUniqVariables.map(buildFilter)].filter((f: any) => f.id)) ||
      [];
    const filters = (query && query.filters && JSON.parse(query.filters)) || '';

    return { query, filters, fields };
  };

  const { fields, filters } = makeFilters({ apiCore, apiModel });

  return (
    <>
      <div>
        <Sidebar
          sidebar={
            <Options
              filters={filters}
              fields={fields}
              handleUpdateFilter={handleUpdateFilter}
              query={query}
              lookup={apiCore.lookup}
            />
          }
          open={sidebarOpen}
          onSetOpen={setSidebarOpen}
          styles={{ sidebar: { background: 'white' } }}
          pullRight
        >
          test
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
                <GroupTable results={results} error={error} loading={loading} />
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Container;
