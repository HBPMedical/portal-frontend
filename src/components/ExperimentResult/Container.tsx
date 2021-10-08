import * as React from 'react';
import { Card } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { APICore, APIExperiment, APIModel } from '../API';
import Datasets from '../UI/Datasets';
import Model from '../UI/Model';
import { Exareme } from '../API/Exareme';
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

class Experiment extends React.Component<Props> {
  private intervalId: any;

  async componentDidMount(): Promise<void> {
    const params = this.urlParams(this.props);
    if (!params) {
      return;
    }
    const { uuid } = params;
    const { apiExperiment, apiModel } = this.props;

    const experiment = await apiExperiment.get({ uuid });
    if (apiExperiment.state.experiment?.status === 'pending') {
      this.pollFetchExperiment(uuid);
    }

    const e = apiExperiment.isExperiment(apiExperiment.state.experiment);
    if (e) {
      Exareme.handleSelectExperimentToModel(apiModel, e);

      if (!e.viewed) {
        apiExperiment.markAsViewed({ uuid });
      }
    }

    return experiment;
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    const params = this.urlParams(this.props);
    if (!params) {
      return;
    }
    const { uuid } = params;
    const previousParams = this.urlParams(prevProps);
    const previousUUID = previousParams && previousParams.uuid;

    const { apiExperiment, apiModel } = this.props;
    if (uuid !== previousUUID) {
      await apiExperiment.get({ uuid });
      const e = apiExperiment.isExperiment(apiExperiment.state.experiment);
      if (e) {
        Exareme.handleSelectExperimentToModel(apiModel, e);
        if (!e.viewed) {
          apiExperiment.markAsViewed({ uuid });
        }
      }

      if (apiExperiment.state.experiment?.status === 'pending') {
        this.pollFetchExperiment(uuid);
      }
    } else {
      if (apiExperiment.state.experiment?.status !== 'pending') {
        clearInterval(this.intervalId);
      }
    }
  }

  componentWillUnmount(): void {
    clearInterval(this.intervalId);
  }

  render(): JSX.Element {
    const { apiExperiment, apiModel, apiCore } = this.props;
    const model = apiModel?.state?.model;
    const experiment = apiExperiment.state.experiment;

    return (
      <div className="Experiment Result">
        <div className="header">
          <ExperimentResultHeader
            experiment={apiExperiment.isExperiment(
              apiExperiment.state.experiment
            )}
            handleDeleteExperiment={this.handleDeleteExperiment}
            handleShareExperiment={this.handleShareExperiment}
            handleCreateNewExperiment={this.handleCreateNewExperiment}
          />
        </div>
        <div className="content">
          <div className="sidebar">
            <Card>
              <Card.Body>
                {model?.query?.pathology && (
                  <section>
                    <h4>Pathology</h4>
                    <p>{model?.query?.pathology || ''}</p>
                  </section>
                )}
                <section>
                  <Datasets model={model} />
                </section>
                <section>
                  <Algorithm
                    experiment={apiExperiment.isExperiment(experiment)}
                  />
                </section>
                <section>
                  <Model model={model} lookup={apiCore.lookup} />
                </section>
              </Card.Body>
            </Card>
          </div>
          <div className="results">
            <ExperimentResult experimentState={apiExperiment.state} />
          </div>
        </div>
      </div>
    );
  }

  private urlParams = (
    props: Props
  ):
    | {
        uuid: string;
        slug: string;
      }
    | undefined => {
    const { match } = props;
    if (!match) {
      return;
    }
    return match.params;
  };

  private handleDeleteExperiment = (uuid: string): void => {
    const { apiExperiment } = this.props;
    apiExperiment.delete({ uuid });
    const { history } = this.props;
    history.push(`/experiment`);
  };

  private handleShareExperiment = async (): Promise<void> => {
    const { apiExperiment } = this.props;
    const experiment = apiExperiment.isExperiment(
      apiExperiment.state.experiment
    );
    const shared = experiment?.shared;
    const params = this.urlParams(this.props);

    if (!params) {
      return;
    }

    const { uuid } = params;
    return shared
      ? await apiExperiment.markAsUnshared({ uuid })
      : await apiExperiment.markAsShared({ uuid });
  };

  private handleCreateNewExperiment = (): void => {
    const { history } = this.props;
    history.push(`/analysis`);
  };

  private pollFetchExperiment = (uuid: string): void => {
    clearInterval(this.intervalId);
    const { apiExperiment } = this.props;
    this.intervalId = setInterval(async () => {
      await apiExperiment.get({ uuid });
      if (apiExperiment.state.experiment?.status !== 'pending') {
        clearInterval(this.intervalId);
      }
    }, 10 * 1000);
  };
}

export default withRouter(Experiment);
