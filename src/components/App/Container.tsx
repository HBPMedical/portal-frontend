import * as React from 'react';
import ReactGA from 'react-ga';
import { Redirect, Route, Router } from 'react-router-dom';
import { Provider, Subscribe } from 'unstated';
import {
  APICore,
  APIExperiment,
  APIMining,
  APIModel,
  APIUser,
  backendURL,
  webURL
} from '../API';
import config from '../API/RequestHeaders';
import App, { AppConfig } from '../App/App';
import Splash from '../UI/Splash';
import { history } from '../utils';
import MIPContext from './MIPContext';

// UNSTATED.logStateChanges = process.env.NODE_ENV === "development";

interface State {
  appConfig: AppConfig;
  showTutorial: boolean;
}

class AppContainer extends React.Component<any, State> {
  state: State = {
    appConfig: {},
    showTutorial: true
  };
  private apiExperiment = new APIExperiment(config);
  private apiModel = new APIModel(config);
  private apiCore = new APICore(config);
  private apiMining = new APIMining(config);
  private apiUser = new APIUser(config);

  private intervalId: any; // FIXME: NodeJS.Timer | undefined;

  async componentDidMount(): Promise<[void, void, void] | void> {
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
      // Experiments polling and auth by interval
      this.intervalId = setInterval(() => {
        this.apiUser.user().then(() => {
          if (this.apiUser.state.authenticated) {
            this.apiExperiment.list({});
          } else {
            clearInterval(this.intervalId);
          }
        });
      }, 10 * 1000);

      return await Promise.all([
        this.apiExperiment.list({}),
        this.apiCore.fetchPathologies(),
        this.apiCore.algorithms()
      ]);
    }

    return Promise.resolve();
  }

  componentWillUnmount(): void {
    clearInterval(this.intervalId);
  }

  render(): JSX.Element {
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
                const authenticated = apiUser.state.authenticated;

                return (
                  <>
                    <Route
                      // Callback from the auth server
                      path="/services/"
                      exact={true}
                      // tslint:disable-next-line jsx-no-lambda
                      render={() => <Redirect to={'/'} />}
                    />
                    {!authenticated && (
                      <Splash
                        login={() => {
                          window.location.href = `${backendURL}/sso/login`;
                        }}
                      />
                    )}

                    {authenticated && (
                      <App
                        appConfig={this.state.appConfig}
                        apiExperiment={apiExperiment}
                        apiCore={apiCore}
                        apiModel={apiModel}
                        apiMining={apiMining}
                        apiUser={apiUser}
                        showTutorial={this.state.showTutorial}
                      />
                    )}
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
