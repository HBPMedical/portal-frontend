import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { APICore, APIMining, backendURL } from '../API';
import { configurationVar, currentUserVar } from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  useActiveUserQuery,
  useGetConfigurationQuery,
  useListDomainsQuery,
  useLogoutMutation
} from '../API/GraphQL/queries.generated';
import { makeAssetURL } from '../API/RequestURLS';
import { DescriptiveAnalysis } from '../DescriptiveAnalysis';
import ExperimentCreate from '../ExperimentCreate/Container';
import Explore from '../ExperimentExplore/Container';
import ExperimentResult from '../ExperimentResult/Container';
import Help from '../Help/Videos';
import ProtectedRoute from '../router/ProtectedRoute';
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
  height: 100vh;
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
  const history = useHistory();

  const [logoutMutation] = useLogoutMutation({
    variables: {},
    onCompleted: () => {
      window.location.href = '/';
    }
  });

  const {
    data: { configuration } = {},
    loading: configLoading
  } = useGetConfigurationQuery({
    onCompleted: data => {
      if (data.configuration) {
        localMutations.setConfiguration(data.configuration);
        const favicon = document.getElementById('favicon') as HTMLLinkElement;
        favicon.href = makeAssetURL('favicon.png');
      }
    }
  });

  const { loading: userLoading, data: userData } = useActiveUserQuery({
    onCompleted: data => {
      if (data.user) localMutations.user.select(data.user);
    }
  });

  //load domains for every page
  const { loading: domainsLoading } = useListDomainsQuery({
    onCompleted: data => {
      if (data.domains) {
        localMutations.setDomains(data.domains);
        localMutations.selectDomain(data.domains[0].id);
      }
    }
  });

  const loading = configLoading || userLoading || domainsLoading;

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

  // TODO : Find out why this component is reloaded multiple times

  return (
    <>
      <GlobalStyles />
      {loading && (
        <SpinnerContainer>
          <Spinner animation="border" variant="info" />
        </SpinnerContainer>
      )}
      {!loading && (
        <>
          <header>
            <Navigation
              name={appConfig.instanceName}
              isAnonymous={isAnonymous}
              authenticated={authenticated}
              login={(): void => {
                if (!isAnonymous) {
                  if (configuration?.enableSSO)
                    window.location.href = `${backendURL}/sso/login`;
                  else {
                    history.push('/login');
                  }
                }
              }}
              datacatalogueUrl={appConfig.datacatalogueUrl || undefined}
              logout={() => {
                logoutMutation();
              }}
            >
              <DropdownExperimentList
                hasDetailedView={true}
                label={'My Experiments'}
              />
            </Navigation>
          </header>
          <Main showTutorial={showTutorial}>
            <Switch>
              {showTutorial && <Tutorial />}

              <Route path="/training" exact={true}>
                <Help />
              </Route>

              <Route path="/login" render={() => <LoginPage />} />

              <Route path="/access" exact={true}>
                <AccessPage />
              </Route>

              <Route path="/tos">
                <TOS />
              </Route>

              <ProtectedRoute path={['/', '/explore']} exact={true}>
                <Explore apiCore={apiCore} apiMining={apiMining}></Explore>
              </ProtectedRoute>

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
          </Main>
          <footer>
            <Footer appConfig={appConfig} />
          </footer>
        </>
      )}
    </>
  );
};

export default App;
