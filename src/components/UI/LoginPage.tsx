import * as React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import HBPLogo from '../../images/logo_135.png';
import Helpdesk from './Helpdesk';

const StyledContainer = styled(Container)`
  margin: 16px auto 0 auto;
  display: flex;
  flex-direction: row;
  padding: 0;

  @media (min-width: 1400px) {
    max-width: 1280px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledJumbotron = styled(Jumbotron)`
  margin-bottom: 0;
  border-radius: 0;
  flex: 2;
  background-color: #ffffffaa;
  border-right: 1px solid #ddd;
`;

const SideCard = styled.div`
  margin: 0;
  padding: 32px;
  flex: 1;
  background-color: #ffffffaa;
`;

const Logo = styled.img`
  width: 135px;
  height: 135px;
  display: block;
  margin: 16px auto 32px auto;
`;

export default (): JSX.Element => {
  return (
    <StyledContainer>
      <StyledJumbotron>
        <h1 className="display-4">The Medical Informatics Platform</h1>
        <h3>About</h3>
        <p className="lead">
          The Medical Informatics Platform (MIP) is the most advanced, fully
          operational, open source platform for sharing of decentralized
          clinical data.
        </p>

        <p className="lead">
          Clinical data that cannot be shared, transferred and stored in a
          centralized way can be federated and collaboratively analysed.{' '}
        </p>
        <p className="lead">
          Data Owners have full control of accessibility and sharing of their
          data through a tightly controlled accreditation, access control and
          user management system.
        </p>
        <p className="lead">
          For detailed information:{' '}
          <a
            href="https://ebrains.eu/service/medical-informatics-platform/"
            target="_blank"
            rel="noopener noreferrer"
          >
            EBRAINS website
          </a>
        </p>
        <hr className="my-4" />
        <h3>The MIP explained</h3>
        <ul>
          <li>
            General introduction:{' '}
            <a
              href="https://github.com/HBPMedical/mip-docs/blob/master/deployment-pack/executive-summary.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Executive Summary
            </a>
          </li>
          <li>
            Technical overview:
            <a
              href="https://github.com/HBPMedical/mip-docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Technical description
            </a>
          </li>
          <li>
            Available algorithms: Description of{' '}
            <a
              href="https://github.com/HBPMedical/mip-docs/blob/master/algorithms.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Algorithms for Federated Analysis
            </a>
          </li>
          <li>
            Watch the <Link to={`/training`}>video tutorials</Link>
          </li>
          <li>
            <a
              href="https://github.com/HBPMedical/mip-docs/blob/master/deployment-pack/faq.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQ
            </a>
          </li>
        </ul>
      </StyledJumbotron>
      <SideCard>
        <Logo alt="HBP logo" title={'Human Brain Project'} src={HBPLogo} />
        <h3>Get access to the MIP</h3>
        <p>
          <strong>
            You need an{' '}
            <a
              href="https://ebrains.eu/register"
              target="_blank"
              rel="noopener noreferrer"
            >
              EBRAINS user account
            </a>{' '}
            to access the MIP.
          </strong>
        </p>
        <p>
          Access to the different federations will be granted on a case-by case
          basis, and is only possible for fully accredited users. Specify your
          request in the form below or by mail at{' '}
          <a href="mailto://support@ebrains.eu">support@ebrains.eu</a>
        </p>
        <Helpdesk formId={'login-mailform'} />
      </SideCard>
    </StyledContainer>
  );
};
