import * as React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';
import styled from 'styled-components';
import HBPLogo from '../../images/logo_135.png';

const StyledContainer = styled(Container)`
  margin: 16px auto 0 auto;
  display: flex;
  flex-direction: row;
  padding: 0;

  @media (min-width: 1400px) {
    max-width: 930px;
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

const Logo = styled.img`
  width: 120px;
  height: 120px;
  display: block;
  margin: 0px auto 32px auto;
`;

export default (): JSX.Element => {
  return (
    <StyledContainer>
      <StyledJumbotron>
        <Logo alt="HBP logo" title={'Human Brain Project'} src={HBPLogo} />
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
          Documentation about the project can be found on{' '}
          <a
            href="https://github.com/hbpmedical/mip-docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
        <p className="lead">
          For more detailed information:{' '}
          <a
            href="https://ebrains.eu/service/medical-informatics-platform/"
            target="_blank"
            rel="noopener noreferrer"
          >
            EBRAINS website
          </a>
          .
        </p>
        <hr className="my-4" />
        <h3>Get access to the MIP</h3>
        <p>
          To access the MIP an EBRAINS account is required. If you do not have
          one yet, you can{' '}
          <strong>
            <a
              href="https://iam.ebrains.eu/register"
              target="_blank"
              rel="noopener noreferrer"
            >
              register an account on EBRAINS
            </a>
          </strong>
          .
        </p>
      </StyledJumbotron>
    </StyledContainer>
  );
};
