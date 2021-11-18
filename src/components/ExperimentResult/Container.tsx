import * as React from 'react';
import { Card } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { APICore, APIExperiment, APIModel } from '../API';
import { selectedExperimentVar, VariableEntity } from '../API/Core';
import {
  useEditExperimentMutation,
  useGetExperimentQuery
} from '../API/GraphQL/queries.generated';
import { Experiment } from '../API/GraphQL/types.generated';
import FilterDisplay from '../UI/FilterDisplay';
import ListSection from '../UI/ListSection';
import Loader from '../UI/Loader';
import VariablesDisplay from '../UI/VariablesDisplay';
import { ExperimentResult, ExperimentResultHeader } from './';
import Algorithm from './Algorithms';

interface RouteParams {
  uuid: string;
  slug: string;
}

interface Props extends RouteComponentProps<RouteParams> {
  apiExperiment: APIExperiment;
  apiModel: APIModel;
  apiCore: APICore;
}

const Container = ({ ...props }: Props): JSX.Element => {
  //const [getDog, { loading, error, data }] = useExperimentLazyQuery();
  const uuid = props.match.params.uuid;

  const [editExperimentMutation] = useEditExperimentMutation();

  const { loading, data, stopPolling, startPolling } = useGetExperimentQuery({
    variables: { id: uuid },
    onCompleted: data => {
      selectedExperimentVar(data.experiment as Experiment);
      if (data && data.experiment.status !== 'pending') {
        stopPolling();
        if (!data.experiment.viewed)
          editExperimentMutation({
            variables: {
              id: data.experiment.id ?? '',
              data: {
                viewed: true
              }
            }
          });
      } else {
        startPolling(500);
      }
    },
    onError: data => {
      console.log('error', data);
    }
  });

  const lookup = (id: string): VariableEntity => {
    return props.apiCore.lookup(id, data?.experiment.domain);
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="Experiment Result">
          <div className="header">
            <ExperimentResultHeader
              experiment={data?.experiment as Experiment}
            />
          </div>
          <div className="content">
            <div className="sidebar">
              <Card>
                <Card.Body>
                  <ListSection
                    title="Domain"
                    list={[data?.experiment.domain ?? '']}
                  />
                  <ListSection
                    title="Datasets"
                    list={data?.experiment.datasets}
                  />
                  <section>
                    {data?.experiment && (
                      <Algorithm algorithm={data.experiment.algorithm} />
                    )}
                  </section>
                  <VariablesDisplay
                    title="Variables"
                    lookup={lookup}
                    variables={data?.experiment.variables}
                  />
                  <VariablesDisplay
                    title="CoVariates"
                    lookup={lookup}
                    variables={
                      data?.experiment.coVariables?.filter(v => v) ?? undefined
                    }
                  />
                  <FilterDisplay
                    filter={data?.experiment.filter ?? ''}
                    lookup={lookup}
                  />
                </Card.Body>
              </Card>
            </div>
            <div className="results">
              <ExperimentResult experiment={data?.experiment as Experiment} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(Container);
