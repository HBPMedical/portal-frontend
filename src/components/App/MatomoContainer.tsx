import { createInstance, MatomoProvider } from '@datapunt/matomo-tracker-react';
import React from 'react';
import { useGetMatomoQuery } from '../API/GraphQL/queries.generated';

type Props = {};

const MatomoContainer = ({ children }: React.PropsWithChildren<Props>) => {
  const { data: { configuration } = {}, loading } = useGetMatomoQuery();
  const matomoInstance =
    configuration?.matomo &&
    configuration.matomo.enabled &&
    configuration.matomo.urlBase &&
    configuration.matomo.siteId
      ? createInstance({
          urlBase: configuration.matomo.urlBase,
          siteId: parseInt(configuration.matomo.siteId),
          linkTracking: false,
          configurations: {
            disableCookies: true
          }
        })
      : undefined;

  return matomoInstance && !loading ? (
    <MatomoProvider value={matomoInstance}>{children}</MatomoProvider>
  ) : (
    <>{children}</>
  );
};

export default MatomoContainer;
