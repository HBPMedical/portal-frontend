import * as React from 'react';
import ReactGA from 'react-ga';
import { Route, Router } from 'react-router-dom';
import { Provider, Subscribe } from 'unstated';

// import UNSTATED from 'unstated-debug';
import {
  APICore,
  APIExperiment,
  APIMining,
  APIModel,
  APIUser,
  webURL
} from '../API'; // as interfaces
import config from '../API/RequestHeaders';
import App, { AppConfig } from '../App/App';
import { history } from '../utils';
import MIPContext from './MIPContext';

// UNSTATED.logStateChanges = process.env.NODE_ENV === "development";

interface State {
  appConfig: AppConfig;
  showTutorial: boolean;
}

class AppContainer extends React.Component<any, State> {
  public state: State = {
    appConfig: {},
    showTutorial: false
  };
  private apiExperiment = new APIExperiment(config);
  private apiModel = new APIModel(config);
  private apiCore = new APICore(config);
  private apiMining = new APIMining(config);
  private apiUser = new APIUser(config);

  private intervalId: any; // FIXME: NodeJS.Timer | undefined;

  public async componentDidMount(): Promise<
    [void, void, void, void, void, void] | void
  > {
    const seenTutorial = localStorage.getItem('seenTutorial') === 'true';

    // Conf written by dockerize
    let appConfig: AppConfig;
    const response = await fetch(`${webURL}/static/config.json`);
    try {
      const config = await response.json();
      appConfig = {
        ...config,
        datacatalogueUrl:
          config.datacatalogueUrl === '0' ? undefined : config.datacatalogueUrl
      };
      this.setState({ appConfig, showTutorial: !seenTutorial });

      if (appConfig.ga) {
        ReactGA.initialize(appConfig.ga);
      }
    } catch (e) {
      appConfig = {
        instanceName: 'MIP DEV',
        version: 'alpha',
        datacatalogueUrl: undefined
      };

      this.setState({ appConfig, showTutorial: !seenTutorial });
    }

    await this.apiUser.user();
    if (this.apiUser.state.authenticated) {
      const username =
        this.apiUser.state.user && this.apiUser.state.user.username;

      // Experiments polling and auth by interval
      this.intervalId = setInterval(() => {
        this.apiUser.user().then(() => {
          if (this.apiUser.state.authenticated) {
            this.apiExperiment.all();
          } else {
            clearInterval(this.intervalId);
          }
        });
      }, 10 * 1000);

      return await Promise.all([
        this.apiUser.profile({ username }),
        this.apiExperiment.all(),
        this.apiCore.fetchPathologies(),
        this.apiCore.algorithms(),
        this.apiCore.stats(),
        this.apiModel.all()
      ]);
    }

    return Promise.resolve();
  }

  public componentWillUnmount(): void {
    clearInterval(this.intervalId);
  }

  public render(): JSX.Element {
    const toggleTutorial = (): void => {
      localStorage.setItem('seenTutorial', 'true');
      this.setState(state => ({
        ...state,
        showTutorial: !state.showTutorial
      }));
    };

    return (
      <MIPContext.Provider
        value={{
          showTutorial: this.state.showTutorial,
          toggleTutorial
        }}
      >
        <Provider
          inject={[
            this.apiExperiment,
            this.apiCore,
            this.apiModel,
            this.apiMining,
            this.apiUser
          ]}
        >
          <Router history={history}>
            <Subscribe
              to={[APIExperiment, APICore, APIModel, APIMining, APIUser]}
            >
              {(
                apiExperiment: APIExperiment,
                apiCore: APICore,
                apiModel: APIModel,
                apiMining: APIMining,
                apiUser: APIUser
              ): JSX.Element => {
                return (
                  <>
                    <Route
                      // Callback from the auth server, redirected to the API
                      path="/services/login/hbp"
                      // tslint:disable-next-line jsx-no-lambda
                      render={(props): JSX.Element => {
                        const {
                          location: { search }
                        } = props;
                        apiUser.login(search);

                        return <div />;
                      }}
                    />
                    <App
                      appConfig={this.state.appConfig}
                      apiExperiment={apiExperiment}
                      apiCore={apiCore}
                      apiModel={apiModel}
                      apiMining={apiMining}
                      apiUser={apiUser}
                    />
                  </>
                );
              }}
            </Subscribe>
          </Router>
        </Provider>
      </MIPContext.Provider>
    );
  }
}

export default AppContainer;
