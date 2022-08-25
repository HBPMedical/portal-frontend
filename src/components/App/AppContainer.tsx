import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { webURL } from '../API';
import { appConfigVar } from '../API/GraphQL/cache';
import { AppConfig, history } from '../utils';
import App from './App';
import MIPContext from './MIPContext';

const AppContainer = (): JSX.Element => {
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const appConfig = useReactiveVar(appConfigVar);

  const toggleTutorial = (): void => {
    localStorage.setItem('seenTutorial', 'true');
    setShowTutorial(!showTutorial);
  };

  useEffect(() => {
    const seenTutorial = localStorage.getItem('seenTutorial') === 'true';

    setShowTutorial(!seenTutorial);

    const fetchData = async () => {
      // Conf written by dockerize
      const response = await fetch(`${webURL}/static/config.json`);
      const data: AppConfig = await response.json();

      appConfigVar(data);
    };

    fetchData().catch(() => {
      appConfigVar({
        instanceName: 'MIP Development',
        version: 'dev',
        datacatalogueUrl: undefined,
        experimentsListRefresh: `${1000 * 60 * 15}`,
        matomo: {
          enabled: false
        }
      });
    });
  }, []);

  return (
    <MIPContext.Provider
      value={{
        showTutorial: showTutorial,
        toggleTutorial
      }}
    >
      <Router history={history}>
        <App appConfig={appConfig} showTutorial={showTutorial} />
      </Router>
    </MIPContext.Provider>
  );
};

export default AppContainer;
