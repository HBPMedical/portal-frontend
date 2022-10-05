import { useReactiveVar } from '@apollo/client';
import { createInstance, MatomoProvider } from '@jonkoops/matomo-tracker-react';
import { appConfigVar } from '../API/GraphQL/cache';

type Props = {
  children: JSX.Element;
};

const MatomoContainer = ({ children }: Props) => {
  const appConfig = useReactiveVar(appConfigVar);
  const config = appConfig.matomo;
  const matomoInstance =
    config && config.enabled && config.urlBase && config.siteId
      ? createInstance({
          urlBase: config.urlBase,
          siteId: parseInt(config.siteId),
          linkTracking: false,
          configurations: {
            disableCookies: true,
          },
        })
      : undefined;

  if (matomoInstance)
    return <MatomoProvider value={matomoInstance}>{children}</MatomoProvider>;

  return <>{children}</>;
};

export default MatomoContainer;
