import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { configurationVar } from '../API/GraphQL/cache';
import { makeAssetURL } from '../API/RequestURLS';
import ShepherdContainer from '../UserGuide/shepherdContainer';
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

  .experiments.dropdown-list {
    margin-right: 10px;

    & > .dropdown-btn {
      color: white;
      &:hover {
        color: #ccc !important;
        text-decoration: none;
      }
    }
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

  img {
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
  svg {
    vertical-align: -0.125em;
  }
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
  children: JSX.Element;
}

const Navigation = ({
  isAnonymous,
  authenticated,
  login,
  name,
  datacatalogueUrl,
  logout,
  children,
}: Props): JSX.Element => {
  const instanceName = name || 'MIP';
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const config = useReactiveVar(configurationVar);

  useEffect(() => {
    if (!config.version) return;
    setImageURL(makeAssetURL('logo_small.png'));
  }, [config.version]);

  return (
    <NavBar>
      <Brand className="experiment-nav">
        <Link to="/">{imageURL && <img src={imageURL} alt="Logo" />}</Link>
        <Link className="logo-title" to="/">
          {instanceName}
        </Link>
      </Brand>
      {authenticated && (
        <Links>
          <Group className="experiment-nav experiment-sections">
            <GroupLink to="/explore">Variables</GroupLink>
            <span> &gt; </span>
            <GroupLink to="/analysis">Analysis</GroupLink>
            <span> &gt; </span>
            <GroupLink to="/experiment">Experiment</GroupLink>
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
        <ShepherdContainer />
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
          <LogoutButton variant={'outline-danger'} size={'sm'} onClick={logout}>
            <FaSignOutAlt /> Logout
          </LogoutButton>
        )}
      </RightLinks>
    </NavBar>
  );
};

export default Navigation;
