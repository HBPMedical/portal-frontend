import { ApolloProvider } from '@apollo/client';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { apolloClient } from './components/API/GraphQL/apollo.config';
import { default as AppContainer } from './components/App/Container';
import './index.css';
import { unregister } from './registerServiceWorker';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

const commonApp = (): JSX.Element => {
  const matomoInstance = createInstance({
    urlBase: `${window.location.protocol}//stats.humanbrainproject.eu/`,
    siteId: 29,
    linkTracking: false,
    configurations: {
      disableCookies: true
    },
    disabled: process.env.NODE_ENV !== 'production'
  });
  return (
    <ApolloProvider client={apolloClient}>
      <MatomoProvider value={matomoInstance}>
        <AppContainer />
      </MatomoProvider>
    </ApolloProvider>
  );
};

const AppBox = (): JSX.Element => {
  if (process.env.NODE_ENV === 'production') {
    const bugsnagClient = bugsnag('87e28aed7927156bee7f8accd10ed20a');
    bugsnagClient.use(bugsnagReact, React);
    const ErrorBoundary = bugsnagClient.getPlugin('react');
    return (
      <ErrorBoundary>
        <React.StrictMode>{commonApp()}</React.StrictMode>
      </ErrorBoundary>
    );
  }

  return commonApp();
};

ReactDOM.render(AppBox(), document.getElementById('root') as HTMLElement);
unregister();
