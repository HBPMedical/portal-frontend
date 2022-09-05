import { ApolloProvider } from '@apollo/client';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import { apolloClient } from './components/API/GraphQL/apollo.config';
import AppContainer from './components/App/AppContainer';
import MatomoContainer from './components/App/MatomoContainer';
import './index.css';
import { unregister } from './registerServiceWorker';
import { createRoot } from 'react-dom/client';

const commonApp = (): JSX.Element => {
  return (
    <ApolloProvider client={apolloClient}>
      <MatomoContainer>
        <AppContainer />
      </MatomoContainer>
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

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(<AppBox />);
unregister();
