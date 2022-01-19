import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import {
  APICore,
  APIExperiment,
  APIMining,
  APIModel,
  APIUser,
  backendURL
} from '../API';
import { DescriptiveAnalysis } from '../DescriptiveAnalysis';
import ExperimentCreate from '../ExperimentCreate/Container';
import Explore from '../ExperimentExplore/Container';
import ExperimentResult from '../ExperimentResult/Container';
import Help from '../Help/Videos';
import DataCatalog from '../UI/DataCatalog';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import Footer from '../UI/Footer';
import Galaxy from '../UI/Galaxy';
import { GlobalStyles } from '../UI/GlobalStyle';
import LoginPage from '../UI/LoginPage';
import Navigation from '../UI/Navigation';
import NotFound from '../UI/NotFound';
import TOS from '../UI/TOS';
import Tutorial from '../UserGuide/Tutorial';

const Main = styled.main<MainProps>`
  margin: 0 auto;
  padding: 52px 8px;
  min-height: 100vh;

  ${(prop): string =>
    prop.showTutorial &&
    `
   :after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 1;
    transition: all 0.5s;
  }
   `}
`;

const SpinnerContainer = styled.div`
  display: flex;
  min-height: inherit;
  justify-content: center;
  align-items: center;
`;

export interface AppConfig {
  version?: string;
  instanceName?: string;
  ga?: string;
  datacatalogueUrl?: string | undefined;
}
interface Props {
  appConfig: AppConfig;
  apiExperiment: APIExperiment;
  apiCore: APICore;
  apiModel: APIModel;
  apiMining: APIMining;
  apiUser: APIUser;
  showTutorial: boolean;
}

interface MainProps {
  showTutorial: any;
}

const App = ({
  appConfig,
  apiExperiment,
  apiCore,
  apiModel,
  apiMining,
  apiUser,
  showTutorial
}: Props): JSX.Element => {
  const loading = apiUser.state.loading;
  const authenticated = apiUser.state.authenticated || false;
  const isAnonymous = apiUser.state.user?.username === 'anonymous' || false;

  return (
    <>
      <GlobalStyles />
      <header>
        <Navigation
          name={appConfig.instanceName}
          isAnonymous={isAnonymous}
          authenticated={authenticated}
          login={(): void => {
            if (apiUser.state.user?.username !== 'anonymous') {
              window.location.href = `${backendURL}/sso/login`;
            }
          }}
          datacatalogueUrl={appConfig.datacatalogueUrl || undefined}
          logout={() => {
            (apiUser.state.user?.username !== 'anonymous' || undefined) &&
              apiUser.logout();
            window.location.href = '/';
          }}
          experiment={apiExperiment.isExperiment(
            apiExperiment.state.experiment
          )}
        >
          <DropdownExperimentList
            hasDetailedView={true}
            label={'My Experiments'}
          />
        </Navigation>
      </header>
      <Main showTutorial={showTutorial}>
        {loading && (
          <SpinnerContainer>
            <Spinner animation="border" variant="info" />
          </SpinnerContainer>
        )}
        {!loading && (
          <Switch>
            {showTutorial && <Tutorial />}

            {!authenticated && (
              <Route path="/" exact={true}>
                <LoginPage />
              </Route>
            )}

            <Route path="/training" exact={true}>
              <Help />
            </Route>

            {authenticated && (
              <Switch>
                <Route
                  path={['/', '/explore']}
                  exact={true}
                  // tslint:disable-next-line jsx-no-lambda
                  render={(props): JSX.Element => (
                    <Explore
                      apiCore={apiCore}
                      apiMining={apiMining}
                      apiModel={apiModel}
                      appConfig={appConfig}
                      apiUser={apiUser}
                      apiExperiment={apiExperiment}
                      {...props}
                    ></Explore>
                  )}
                />
                <Route
                  path="/tos"
                  // tslint:disable-next-line jsx-no-lambda
                  render={(props): JSX.Element => (
                    <TOS apiUser={apiUser} {...props} />
                  )}
                />

                <Route
                  path={['/review', '/analysis']}
                  // tslint:disable-next-line jsx-no-lambda
                  render={(props): JSX.Element => (
                    <DescriptiveAnalysis apiCore={apiCore} {...props} />
                  )}
                />
                <Route
                  path="/experiment/:uuid"
                  // tslint:disable-next-line jsx-no-lambda
                  render={(): JSX.Element => (
                    <ExperimentResult
                      apiExperiment={apiExperiment}
                      apiModel={apiModel}
                      apiCore={apiCore}
                    />
                  )}
                />
                <Route
                  exact={true}
                  path="/experiment"
                  // tslint:disable-next-line jsx-no-lambda
                  render={(props): JSX.Element => (
                    <ExperimentCreate
                      apiExperiment={apiExperiment}
                      apiCore={apiCore}
                      apiModel={apiModel}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/galaxy"
                  render={(): JSX.Element => <Galaxy apiCore={apiCore} />}
                />
                <Route
                  path="/catalog"
                  render={(): JSX.Element => <DataCatalog />}
                />

                <Route component={NotFound} />
              </Switch>
            )}
          </Switch>
        )}
      </Main>
      <footer>
        <Footer appConfig={appConfig} />
      </footer>
    </>
  );
};

export default App;
