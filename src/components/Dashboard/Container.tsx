import * as React from 'react';
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { Panel, Tab, Tabs } from 'react-bootstrap';
import SinglePage from './SinglePage';
import HBPLogo from '../../images/hbp_logo_135.png';
import { FORBIDDEN_ACCESS_MESSAGE } from '../constants';

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
`;

const Container = styled.main`
  display: flex;
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
        <Panel>
          <Panel.Body>
            <Logo alt="HBP logo" title={'Human Brain Project'} src={HBPLogo} />
            <h2>Human Brain Project</h2>
            <h1>THE MEDICAL INFORMATICS PLATFORM</h1>
          </Panel.Body>
        </Panel>
      </Container>
    </>
  );
};
