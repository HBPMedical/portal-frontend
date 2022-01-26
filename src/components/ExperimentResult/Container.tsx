import { useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { domainsVar } from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useGetExperimentQuery } from '../API/GraphQL/queries.generated';
import { Domain, Experiment } from '../API/GraphQL/types.generated';
import ListSection from '../UI/ListSection';
import Loader from '../UI/Loader';
import Model from '../UI/Model';
import { ExperimentResult, ExperimentResultHeader } from './';

interface RouteParams {
  uuid: string;
  slug: string;
}

type Props = RouteComponentProps<RouteParams>;

const Container = ({ ...props }: Props): JSX.Element => {
  const uuid = props.match.params.uuid;
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [experiment, setExperiment] = useState<Experiment>();
  const [domain, setDomain] = useState<Domain>();
  const domains = useReactiveVar<Domain[]>(domainsVar);

  const { loading, data, startPolling, stopPolling } = useGetExperimentQuery({
    variables: { id: uuid },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true, // needed to refire onCompleted after each poll
    onCompleted: data => {
      const domainId = data.experiment.domain;
      if (domainId) setDomain(domains.find(d => d.id === domainId));

      switch (data.experiment.status) {
        case 'pending':
          if (!isPolling) {
            startPolling(1000);
            setIsPolling(true);
          }
          break;
        case 'success':
          setExperiment(data.experiment as Experiment);
          break;
      }

      if (data.experiment.status !== 'pending' && isPolling) {
        stopPolling();
        setIsPolling(false);
      }
    }
  });

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="Experiment Result">
          <div className="header">
            <ExperimentResultHeader
              handleCopyExperiment={(): void => {
                if (experiment) localMutations.selectExperiment(experiment);
              }}
              experiment={data?.experiment as Experiment}
            />
          </div>
          <div className="content">
            <div className="sidebar">
              <Card>
                <Card.Body>
                  {experiment && (
                    <>
                      <ListSection
                        title="Domain"
                        list={[domain?.label ?? domain?.id ?? '']}
                      />
                      <ListSection
                        title="Datasets"
                        list={
                          domain?.datasets
                            .filter(d => experiment.datasets.includes(d.id))
                            .map(d => d.label ?? d.id) ?? []
                        }
                      />
                      <section>
                        {domain && experiment && (
                          <Model experiment={experiment} domain={domain} />
                        )}
                      </section>
                    </>
                  )}
                </Card.Body>
              </Card>
            </div>
            <div className="results">
              <ExperimentResult experiment={experiment} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(Container);
