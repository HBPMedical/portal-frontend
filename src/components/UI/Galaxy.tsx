import { Base64 } from 'js-base64';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import headers from '../API/RequestHeaders';
import { backendURL } from '../API/RequestURLS';
import { GalaxyConfig } from '../utils';
import GalaxyScreenshot from '../../images/galaxy-screenshot.png';

const IFrameContainer = styled.div`
  width: 100%;
  height: 100%;

  iframe {
    width: calc(100% - 16px);
    height: calc(100% - 88px);
    border: 0;
    position: fixed;
  }
`;

const AlertBox = styled(Alert)`
  position: relative;
  margin: 16px;
`;

export default React.memo(() => {
  const divRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [config, setConfig] = useState<GalaxyConfig>();

  useEffect(() => {
    const fetchConfig = async (): Promise<void> => {
      let config = { error: { message: 'Unknow error' } };
      try {
        const response = await fetch(`${backendURL}/galaxy`, {
          ...headers.options,
          credentials: headers.options.credentials as RequestCredentials,
        });

        if (response.ok) {
          config = await response.json();
        }
      } catch (e) {
        config = { error: { message: `Error: ${e}` } };
      }

      if (config) {
        if (config.error) {
          setError(config.error.message || 'Access denied');

          return;
        }

        setConfig(config);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config) {
      try {
        const { authorization, context } = config;
        if (authorization && context) {
          const req = new XMLHttpRequest();
          const [user, password] = Base64.decode(authorization).split(':');
          req.open('POST', context, false, user, password);
          req.send(null);

          if (req.status === 404) {
            setWarning(
              'This fuctionality is available by request at support@ebrains.eu'
            );

            return;
          }

          if (divRef && divRef.current) {
            divRef.current.src = context;
          }
        }
      } catch (error: unknown) {
        setError(`${error}`);
      }
    }
  }, [config]);

  return (
    <IFrameContainer>
      {error && (
        <AlertBox variant="danger">
          <strong>There was an error</strong> {error}
        </AlertBox>
      )}
      {warning && (
        <div>
          <AlertBox variant="warning">{warning}</AlertBox>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{ border: '1px gray solid', marginTop: '32px' }}
              src={GalaxyScreenshot}
              alt="Galaxy"
            />
            <p style={{ marginTop: '8px', color: 'GrayText' }}>
              Galaxy Workflow
            </p>
          </div>
        </div>
      )}
      {!warning && !error && <iframe title="Galaxy Workflow" ref={divRef} />}
    </IFrameContainer>
  );
});
