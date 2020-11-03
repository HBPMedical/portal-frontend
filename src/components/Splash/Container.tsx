import * as React from 'react';
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import HBPLogo from '../../images/hbp_logo_135.png';
import { FORBIDDEN_ACCESS_MESSAGE } from '../constants';
import Helpdesk from '../UI/Helpdesk';
import { Link } from 'react-router-dom';

const AlertBox = styled(Alert)`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
`;

const Logo = styled.img`
  width: 135px;
  height: 135px;
  display: block;
  margin: 16px auto 32px auto;
  float: right;
`;

const Container = styled.main`
  margin: 16px auto 0 auto;
  width: 1200px;
  display: flex;
  flex-direction: row;
  font-size: 1.6rem;
`;

const Sidebar = styled(Panel)`
  margin: 0 8px;
  width: 600px;
`;

export default ({ forbidden }: { forbidden?: boolean }): JSX.Element => {
  return (
    <>
      {forbidden && (
        <AlertBox bsStyle="success">
          <div
            dangerouslySetInnerHTML={{
              __html: `${FORBIDDEN_ACCESS_MESSAGE}`
            }}
          />
        </AlertBox>
      )}
      <Container>
        <div>
          <Panel style={{ padding: '32px' }}>
            <Panel.Body>
              <div>
                <Logo
                  alt="HBP logo"
                  title={'Human Brain Project'}
                  src={HBPLogo}
                />
                <h1>THE MEDICAL INFORMATICS PLATFORM</h1>
              </div>
              <div>
                <h3>About</h3>
                <p>
                  The Medical Informatics Platform (MIP) is a privacy
                  preserving, federated data processing and analysis system
                </p>
                <p>
                  The MIP is designed to help clinicians, clinical scientists,
                  and clinical data scientists aiming to adopt advanced
                  analytics for diagnosis and research in clinics.
                </p>
                <p>
                  More information about the MIP can be found on{' '}
                  <a
                    href="https://ebrains.eu/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    EBRAINS website
                  </a>
                </p>
                <h3>Read more about the MIP</h3>
                <ul>
                  <li>
                    Watch the <Link to={`/training`}>video tutorials</Link>
                  </li>
                  <li>
                    An introduction to the MIP:{' '}
                    <a
                      href="https://mip.ebrains.eu/documentation/Deployment%20Pack/1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Executive Summary
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mip.ebrains.eu/documentation/Deployment%20Pack/9"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    Read about the included algorithms:{' '}
                    <a
                      href="https://mip.ebrains.eu/documentation/Technical%20Documents/11"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Federated Analysis Algorithms Descriptions
                    </a>
                  </li>
                  <li>
                    Technical overview:{' '}
                    <a
                      href="https://github.com/HBPMedical/mip-docs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Federated Analysis Algorithms Descriptions
                    </a>
                  </li>
                </ul>
              </div>
            </Panel.Body>
          </Panel>
        </div>
        <Sidebar>
          <Panel.Title>
            <h3>Access the MIP</h3>
          </Panel.Title>
          <Panel.Body>
            <p>
              If you are a registered user of the MIP, you can access it by
              login on the top right button
            </p>
            <p>
              <strong>
                You need an EBRAINS user account to access the MIP.
              </strong>
            </p>
            <p>
              Access to the different federations will be granted on a case-by
              case basis, and is only possible after you have signed in on the
              platform and your user account is registered. Specify your request
              in the form below or by mail at{' '}
              <a href="mailto://support@ebrains.eu">support@ebrains.eu</a>
            </p>
            <Helpdesk formId={'login-mailform'} />
          </Panel.Body>
        </Sidebar>
      </Container>
    </>
  );
};
