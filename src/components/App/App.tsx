import { NetworkStatus, useReactiveVar } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useCallback, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import styled from 'styled-components';
import { SessionState } from '../../utilities/types';
import { backendURL } from '../API';
import { apolloClient } from '../API/GraphQL/apollo.config';
import { configurationVar, sessionStateVar } from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  useActiveUserQuery,
  useGetConfigurationQuery,
  useListDomainsQuery,
  useLogoutMutation,
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
import ShepherdSelectTour from '../UserGuide/shepherdSelectTour';
import analysisTour from '../UserGuide/tours/analysisTour';
import experimentTour from '../UserGuide/tours/experimentTour';
import exploreTour from '../UserGuide/tours/exploreTour';
import resultTour from '../UserGuide/tours/ResultTour';
import { AppConfig } from '../utils';

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

interface Props {
  appConfig: AppConfig;
  showTutorial: boolean;
}

interface MainProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showTutorial: any;
}

const App = ({ appConfig, showTutorial }: Props) => {
  const config = useReactiveVar(configurationVar);
  const history = useHistory();
  const userState = useReactiveVar(sessionStateVar);
  const { enableLinkTracking, trackPageView } = useMatomo();

  enableLinkTracking();

  useEffect(() => {
    trackPageView({});
    history.listen(() => {
      trackPageView({});
    });
  }, [history, trackPageView]);

  const {
    loading: userLoading,
    data: userData,
    networkStatus: userNetwork,
  } = useActiveUserQuery({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [logoutMutation] = useLogoutMutation();

  const logoutHandle = useCallback(async () => {
    history.push('/access');

    try {
      await logoutMutation();
    } catch (e) {
      console.log(
        'Error when logging out, probably user was not authenticated. Negligible error.'
      );
    }

    await apolloClient.clearStore();

    localMutations.user.setState(SessionState.LOGGED_OUT);
  }, [history, logoutMutation]);

  const { data: { configuration } = {}, loading: configLoading } =
    useGetConfigurationQuery({
      onCompleted: (data) => {
        if (data.configuration) {
          localMutations.setConfiguration(data.configuration);
          const favicon = document.getElementById('favicon') as HTMLLinkElement;
          favicon.href = makeAssetURL('favicon.ico');
        }
      },
    });

  const user = userData?.user;
  const isAnonymous = user?.username === 'anonymous' || false;
  const authenticated = !!user && userState !== SessionState.LOGGED_OUT;

  //load domains for every page
  const { loading: domainsLoading, networkStatus: domainNetwork } =
    useListDomainsQuery({
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data.domains) {
          localMutations.setDomains(data.domains);
          localMutations.selectDomain(data.domains[0].id);
        }
      },
    });

  const loading =
    configLoading ||
    userLoading ||
    domainsLoading ||
    domainNetwork === NetworkStatus.refetch ||
    userNetwork === NetworkStatus.refetch;

  useEffect(() => {
    if (!config.version) return;

    const cssPath = makeAssetURL('custom.css');
    const head = document.head;
    const link = document.createElement('link');

    link.crossOrigin = 'anonymous';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = cssPath;

    if (head) head.appendChild(link);

    return (): void => {
      if (head) head.removeChild(link);
    };
  }, [config.version]);

  useEffect(() => {
    if (userState === SessionState.INVALID) {
      if (user) {
        toast.error('Your session has expired');
      } else {
        toast.info('Please login before accessing the MIP');
      }
      logoutHandle();
    }
  }, [logoutHandle, user, userState]);

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
              datacatalogueUrl={appConfig.datacatalogueUrl}
              logout={() => {
                toast.success('Logged out successfully');
                logoutHandle();
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
              <Route path="/training" exact={true}>
                <Help />
              </Route>

              <Route path="/login">
                <LoginPage />
              </Route>

              <Route path="/access" exact={true}>
                <AccessPage />
              </Route>

              <Route path="/tos">
                <TOS />
              </Route>

              <ProtectedRoute path={['/', '/explore']} exact={true}>
                <ShepherdSelectTour id="explore" steps={exploreTour} />
                <Explore />
              </ProtectedRoute>

              <ProtectedRoute path={['/review', '/analysis']}>
                <ShepherdSelectTour id="analysis" steps={analysisTour} />
                <DescriptiveAnalysis />
              </ProtectedRoute>

              <ProtectedRoute path="/experiment/:uuid">
                <ShepherdSelectTour id="result" steps={resultTour} />
                <ExperimentResult />
              </ProtectedRoute>

              <ProtectedRoute exact={true} path="/experiment">
                <ShepherdSelectTour id="experiment" steps={experimentTour} />
                <ExperimentCreate />
              </ProtectedRoute>

              <ProtectedRoute path="/galaxy">
                <Galaxy />
              </ProtectedRoute>

              <Route path="/catalog" render={() => <DataCatalog />} />

              <Route component={NotFound} />
            </Switch>
          </Main>
          <footer>
            <Footer appConfig={appConfig} />
          </footer>
        </>
      )}
      <ToastContainer
        style={{ marginTop: '35px' }}
        position="top-right"
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        autoClose={5000}
      />
    </>
  );
};

export default App;
