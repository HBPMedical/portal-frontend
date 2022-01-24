import * as React from 'react';
import ReactGA from 'react-ga';
import { Router } from 'react-router-dom';
import { Provider, Subscribe } from 'unstated';
import { APICore, APIMining, APIUser, webURL } from '../API';
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
  state: State = {
    appConfig: {},
    showTutorial: true
  };
  private apiCore = new APICore(config);
  private apiMining = new APIMining(config);
  private apiUser = new APIUser(config);

  private intervalId: any; // FIXME: NodeJS.Timer | undefined;

  async componentDidMount(): Promise<void> {
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
        instanceName: 'MIP 6.5 Development',
        version: 'dev 6.5',
        datacatalogueUrl: undefined
      };

      this.setState({ appConfig, showTutorial: false });
    }

    await this.apiUser.user();
    if (this.apiUser.state.authenticated) {
      this.setState({ showTutorial: !seenTutorial });

      // Experiments polling and auth by interval
      this.intervalId = setInterval(() => {
        this.apiUser.user().then(() => {
          if (!this.apiUser.state.authenticated) {
            clearInterval(this.intervalId);
            window.location.href = '/';
          }
        });
      }, 10 * 1000);

      return await this.apiCore.algorithms();
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
        <Provider inject={[this.apiCore, this.apiMining, this.apiUser]}>
          <Router history={history}>
            <Subscribe to={[APICore, APIMining, APIUser]}>
              {(
                apiCore: APICore,
                apiMining: APIMining,
                apiUser: APIUser
              ): JSX.Element => {
                return (
                  <App
                    appConfig={this.state.appConfig}
                    apiCore={apiCore}
                    apiMining={apiMining}
                    apiUser={apiUser}
                    showTutorial={this.state.showTutorial}
                  />
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
