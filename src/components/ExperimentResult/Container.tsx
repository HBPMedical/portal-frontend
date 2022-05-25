import { useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { domainsVar } from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useGetExperimentQuery } from '../API/GraphQL/queries.generated';
import {
  Domain,
  Experiment,
  ExperimentStatus
} from '../API/GraphQL/types.generated';
import ApolloErrorHandler from '../UI/ApolloErrorHandler';
import ListSection from '../UI/ListSection';
import Model from '../UI/Model';
import { ExperimentResult, ExperimentResultHeader } from './';
import AlgorithmDetails from './AlgorithmDetails';

interface RouteParams {
  uuid: string;
  slug: string;
}

type Props = RouteComponentProps<RouteParams>;

const ContainerWrap = ({ ...props }: Props): JSX.Element => {
  const uuid = props.match.params.uuid;
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [experiment, setExperiment] = useState<Experiment>();
  const [domain, setDomain] = useState<Domain>();
  const domains = useReactiveVar<Domain[]>(domainsVar);

  const { startPolling, stopPolling, error } = useGetExperimentQuery({
    variables: { id: uuid },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true, // needed to refire onCompleted after each poll
    onCompleted: data => {
      const domainId = data.experiment.domain;
      const newExperiment = data.experiment as Experiment;
      if (domainId && domainId !== domain?.id)
        setDomain(domains.find(d => d.id === domainId));

      if (newExperiment.status === ExperimentStatus.Pending && !isPolling) {
        startPolling(1000);
        setIsPolling(true);
      }

      if (newExperiment.status !== ExperimentStatus.Pending && isPolling) {
        stopPolling();
        setIsPolling(false);
      }

      if (
        newExperiment.id !== experiment?.id ||
        experiment?.status !== newExperiment.status
      )
        setExperiment(newExperiment);
    }
  });

  return (
    <>
      {error && (
        <Container fluid className="text-center">
          <Row>
            <Col>
              <Card className="py-5">
                <Card.Body>
                  {error.graphQLErrors.map((e, i) => (
                    <ApolloErrorHandler key={i} error={e} />
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
      {!error && (
        <div className="experiment">
          <div className="header">
            <ExperimentResultHeader
              handleCopyExperiment={(): void => {
                if (experiment) localMutations.selectExperiment(experiment);
              }}
              experiment={experiment}
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
                        <AlgorithmDetails result={experiment.algorithm} />
                      </section>
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

export default withRouter(ContainerWrap);
