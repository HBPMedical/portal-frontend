import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { APICore, APIMining, backendURL } from '../API';
import { configurationVar, currentUserVar } from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  useActiveUserQuery,
  useGetConfigurationQuery,
  useListDomainsQuery
} from '../API/GraphQL/queries.generated';
import { makeAssetURL } from '../API/RequestURLS';
import { DescriptiveAnalysis } from '../DescriptiveAnalysis';
import ExperimentCreate from '../ExperimentCreate/Container';
import Explore from '../ExperimentExplore/Container';
import ExperimentResult from '../ExperimentResult/Container';
import Help from '../Help/Videos';
import AccessPage from '../UI/AccessPage';
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
  apiCore: APICore;
  apiMining: APIMining;
  showTutorial: boolean;
}

interface MainProps {
  showTutorial: any;
}

const App = ({ appConfig, apiCore, apiMining, showTutorial }: Props) => {
  //const authenticated = apiUser.state.authenticated || false;

  const config = useReactiveVar(configurationVar);
  const user = useReactiveVar(currentUserVar);
  const isAnonymous = user?.username === 'anonymous' || false;
  const authenticated = !!user;

  const configState = useGetConfigurationQuery({
    onCompleted: data => {
      if (data.configuration) {
        localMutations.setConfiguration(data.configuration);
        const favicon = document.getElementById('favicon') as HTMLLinkElement;
        favicon.href = makeAssetURL('favicon.png');
      }
    }
  });

  useActiveUserQuery({
    onCompleted: data => {
      if (data.user) localMutations.user.select(data.user);
    }
  });

  const loading = configState.loading;

  //load domains for every page
  useListDomainsQuery({
    onCompleted: data => {
      if (data.domains) {
        localMutations.setDomains(data.domains);
        localMutations.selectDomain(data.domains[0].id);
      }
    }
  });

  useEffect(() => {
    if (!config.version) return;

    const cssPath = makeAssetURL('custom.css');
    const head = document.head as HTMLHeadElement;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = cssPath;

    if (head) head.appendChild(link);

    return (): void => {
      if (head) head.removeChild(link);
    };
  }, [config.version]);

  return (
    <>
      <GlobalStyles />
      <header>
        <Navigation
          name={appConfig.instanceName}
          isAnonymous={isAnonymous}
          authenticated={authenticated}
          login={(): void => {
            if (!isAnonymous) {
              // TODO check configuration isSSO
              window.location.href = `${backendURL}/sso/login`;
            }
          }}
          datacatalogueUrl={appConfig.datacatalogueUrl || undefined}
          logout={() => {
            //(!isAnonymous || undefined) apiUser.logout();
            console.log('TODO LOGIN OR SSO LOGIN');
            window.location.href = '/';
          }}
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

            <Route path="/training" exact={true}>
              <Help />
            </Route>

            <Route path="/access" render={() => <AccessPage />} />

            <Route path="/login" render={() => <LoginPage />} />

            {user && (
              <Switch>
                <Route
                  path={['/', '/explore']}
                  exact={true}
                  render={props => (
                    <Explore
                      apiCore={apiCore}
                      apiMining={apiMining}
                      appConfig={appConfig}
                      {...props}
                    ></Explore>
                  )}
                />
                <Route path="/tos" render={() => <TOS />} />

                <Route
                  path={['/review', '/analysis']}
                  render={props => (
                    <DescriptiveAnalysis apiCore={apiCore} {...props} />
                  )}
                />
                <Route
                  path="/experiment/:uuid"
                  render={() => <ExperimentResult />}
                />
                <Route
                  exact={true}
                  path="/experiment"
                  render={props => (
                    <ExperimentCreate apiCore={apiCore} {...props} />
                  )}
                />
                <Route
                  path="/galaxy"
                  render={() => <Galaxy apiCore={apiCore} />}
                />
                <Route path="/catalog" render={() => <DataCatalog />} />

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
