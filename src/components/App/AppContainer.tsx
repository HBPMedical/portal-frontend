import { useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { webURL } from '../API';
import { appConfigVar } from '../API/GraphQL/cache';
import { AppConfig, history } from '../utils';
import App from './App';

const AppContainer = (): JSX.Element => {
  const appConfig = useReactiveVar(appConfigVar);

  useEffect(() => {
    const fetchData = async () => {
      // Conf written by dockerize
      const response = await fetch(`${webURL}/assets/config.json`);
      const data: AppConfig = await response.json();

      appConfigVar(data);
    };

    fetchData().catch(() => {
      appConfigVar({
        instanceName: 'MIP Development',
        version: 'dev',
        experimentsListRefresh: `${1000 * 60 * 15}`,
        matomo: {
          enabled: false,
        },
      });
    });
  }, []);

  return (
    <Router history={history}>
      <App appConfig={appConfig} />
    </Router>
  );
};

export default AppContainer;
