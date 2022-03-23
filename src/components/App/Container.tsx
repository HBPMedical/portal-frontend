import * as React from 'react';
import ReactGA from 'react-ga';
import { Router } from 'react-router-dom';
import { APICore, APIMining, webURL } from '../API';
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
        instanceName: 'MIP 6.6 Development',
        version: 'dev 6.6',
        datacatalogueUrl: undefined
      };

      this.setState({ appConfig, showTutorial: false });
    }
    return await this.apiCore.algorithms();
  }

  render(): JSX.Element {
    console.log('rendered');
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
        <Router history={history}>
          <App
            appConfig={this.state.appConfig}
            apiCore={this.apiCore}
            apiMining={this.apiMining}
            showTutorial={this.state.showTutorial}
          />
        </Router>
      </MIPContext.Provider>
    );
  }
}

export default AppContainer;
