import * as React from 'react';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../../images/logo.png';
import { IExperiment } from '../API/Experiment';

import MIPContext from '../App/MIPContext';
import HelpButton from './HelpButton';

const NavBar = styled.nav`
  position: fixed;
  z-index: 1;
  top: 0;
  width: 100%;
  font-family: 'Open Sans Condensed', sans-serif;
  font-weight: bold;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  box-shadow: 2px 2px 2px #333;

  #experiment-dropdown,
  #help-dropdown {
    font-size: 16px;
  }

  .experiment-nav a:link,
  .experiment-nav a:visited {
    color: #fff;
    text-decoration: none;
  }

  .experiment-nav a:hover,
  .experiment-nav a:active {
    color: #ccc;
    text-decoration: none;
  }

  @media (max-width: 992px) {
    .logo-title,
    .right-nav {
      display: none;
    }
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 0 16px;
  height: 44px;

  font-weight: bold;

  div {
    background: url(${logo}) left center no-repeat;
    width: 40px;
    height: 40px;
  }

  a {
    font-size: 32px !important;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 16px 0 0;

  .active {
    color: #5bc0de !important;
  }
`;

const RightLinks = styled(Links)`
  button {
    color: white;
    font-size: 16px;
  }
`;

const Link = styled(NavLink)`
  font-size: 16px;
  margin: 0 16px 0 0;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  margin: 0 16px;
  span {
    color: white;
    margin: 0 8px 0 0;
  }
`;

const GroupLink = styled(Link)`
  margin: 0 8px 0 0;
`;

const LogoutButton = styled(Button)`
  font-weight: bold;
`;

const LoginButton = styled(Button)`
  font-weight: bold;
`;

const DropdownWrapper = styled.div`
  padding-left: 124px;
`;

interface Props {
  isAnonymous: boolean;
  authenticated: boolean;
  login: () => void;
  name?: string;
  datacatalogueUrl: string | undefined;
  logout?: () => void;
  experiment: IExperiment | undefined;
  children: JSX.Element;
}

export default ({
  isAnonymous,
  authenticated,
  login,
  name,
  datacatalogueUrl,
  logout,
  experiment,
  children
}: Props): JSX.Element => {
  const instanceName = name || 'MIP';

  return (
    <NavBar>
      <Brand className="experiment-nav">
        <Link to="/">
          <div title="Human Brain Project"></div>
        </Link>
        <Link className="logo-title" to="/">
          {instanceName}
        </Link>
      </Brand>
      {authenticated && (
        <Links>
          <Group className="experiment-nav">
            <GroupLink to="/explore">Variables</GroupLink>
            <span> &gt; </span>
            <GroupLink to="/review">Analysis</GroupLink>
            <span> &gt; </span>
            {experiment && (
              <GroupLink to={`/experiment/${experiment.uuid}`}>
                Experiment
              </GroupLink>
            )}
            {!experiment && <GroupLink to="/experiment">Experiment</GroupLink>}
          </Group>
          <DropdownWrapper className="links">{children}</DropdownWrapper>
          <div className="experiment-nav links">
            <Link to="/galaxy">Workflow</Link>
            {datacatalogueUrl && (
              <a
                href={datacatalogueUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Data Catalogue
              </a>
            )}
          </div>
        </Links>
      )}
      <RightLinks className="experiment-nav right-nav">
        <MIPContext.Consumer>
          {({ toggleTutorial }): JSX.Element =>
            (
              <a
                href="/"
                onClick={(
                  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                ): void => {
                  e.preventDefault();
                  toggleTutorial && toggleTutorial();
                }}
              >
                User Guide
              </a>
            ) || <></>
          }
        </MIPContext.Consumer>
        <HelpButton showTraining={true} />
        {!isAnonymous && !authenticated && (
          <LoginButton
            onClick={login}
            size={'sm'}
            variant={'info'}
            type="submit"
          >
            Login
          </LoginButton>
        )}
        {!isAnonymous && authenticated && (
          <LogoutButton variant={'outline-info'} size={'sm'} onClick={logout}>
            Logout
          </LogoutButton>
        )}
      </RightLinks>
    </NavBar>
  );
};
