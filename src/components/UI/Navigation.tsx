import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import { useLocation, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { configurationVar } from '../API/GraphQL/cache';
import { makeAssetURL } from '../API/RequestURLS';
import ShepherdContainer from '../UserGuide/shepherdContainer';
import HelpButton from './HelpButton';
import MipLogoShort from '../../images/mip-logo-short.png';

const NavBar = styled.nav`
  position: fixed;
  z-index: 1;
  top: 0;
  width: 100%;
  height: 70px;
  font-family: 'Open Sans Condensed', sans-serif;
  font-weight: bold;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  // box-shadow: 2px 2px 2px #333;

  #experiment-dropdown,
  #help-dropdown {
    font-size: 16px;
  }

  .experiments.dropdown-list {
    margin-right: 10px;

    & > .dropdown-btn {
      color: #2b33e9;
      &:hover {
        text-decoration-line: underline;
      }
    }
  }

  .experiment-nav a:link,
  .experiment-nav a:visited {
    color: #2b33e9;
    text-decoration: none;
  }

  .experiment-nav a:hover,
  .experiment-nav a:active {
    text-decoration-line: underline;
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
  height: 100%;

  font-weight: bold;

  img {
    width: 100px;
    height: 100%;
  }

  a {
    font-size: 32px !important;
    color: #2b33e9 !important;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 16px 0 0;

  .active {
    color: #fff !important;
  }
`;

const RightLinks = styled(Links)`
  button {
    color: #2b33e9 !important;
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
    color: #2b33e9;
    margin: 0 8px 0 0;
  }
`;

// const GroupLink = styled(Link)`
//   margin: 0 8px 0 0;
//   color: #2b33e9 !important;
// `;

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
  padding-left: 50px;
  color: #2b33e9;
`;

// SVG background components
const VariablesBreadcrumbSVG = ({ isActive }: { isActive: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="89"
    height="44"
    viewBox="0 0 89 44"
    fill="none"
  >
    <path
      d="M6 0.5H74.9971L75.0127 0.518555L88.5 21L75.002 43.4961C75.0013 43.4962 75.0001 43.4971 74.999 43.4971C74.9898 43.4971 74.9808 43.4995 74.9717 43.5H6C2.96243 43.5 0.5 41.0376 0.5 38V6C0.500041 2.96246 2.96246 0.499999 6 0.5ZM74.5166 43.8779C74.507 43.9167 74.5 43.9572 74.5 43.999C74.5 43.9573 74.5069 43.9167 74.5166 43.8779Z"
      fill={isActive ? '#2B33E9' : 'white'}
      stroke="#2B33E9"
      strokeLinecap="round"
    />
  </svg>
);

const AnalysisBreadcrumbSVG = ({ isActive }: { isActive: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="103"
    height="44"
    viewBox="0 0 103 44"
    fill="none"
  >
    <path
      d="M89.0001 0.5L89.0147 0.517578L102.502 20.999L89.004 43.4951C89.0033 43.4952 89.0021 43.4961 89.001 43.4961L88.8848 43.4971L88.8809 43.499H1.16803L14.3594 21.5127C14.5562 21.1843 14.5499 20.7702 14.338 20.4482L1.20123 0.5H89.0001Z"
      fill={isActive ? '#2B33E9' : 'white'}
      stroke="#2B33E9"
      strokeLinecap="round"
    />
  </svg>
);

const BreadcrumbContainer = styled(NavLink)<{ isfirst?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.isfirst === 'true' ? '89px' : '103px')};
  height: 44px;
  margin-left: ${(props) => (props.isfirst === 'true' ? '0' : '-15px')};
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1;
  &:hover {
    text-decoration-line: underline;
  }
  span {
    margin-left: ${(props) => (props.isfirst === 'true' ? '0' : '14px')};
    position: relative;
    z-index: 2;
    pointer-events: none;
  }
`;

const BreadcrumbSVGWrapper = styled.div<{
  isfirst: boolean;
  isActive: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const LogoBreadcrumbs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BreadcrumbItem = ({
  to,
  children,
  isfirst,
}: {
  to: string;
  children: string;
  isfirst: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  console.log(children, isActive);

  return (
    <BreadcrumbContainer to={to} isfirst={isfirst ? 'true' : 'false'}>
      <BreadcrumbSVGWrapper isfirst={isfirst} isActive={isActive}>
        {isfirst ? (
          <VariablesBreadcrumbSVG isActive={isActive} />
        ) : (
          <AnalysisBreadcrumbSVG isActive={isActive} />
        )}
      </BreadcrumbSVGWrapper>
      <span
        style={{
          color: isActive ? 'white' : '#2b33e9',
          textDecorationLine: isActive ? 'underline' : 'none',
        }}
      >
        {children}
      </span>
    </BreadcrumbContainer>
  );
};

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
      <LogoBreadcrumbs>
        <Brand>
          <Link to="/">
            {imageURL && <img src={MipLogoShort} alt="Logo" />}
          </Link>
          <Link className="logo-title" to="/">
            {instanceName}
          </Link>
        </Brand>
        {authenticated && (
          <Links>
            <Group className="experiment-nav experiment-sections">
              <BreadcrumbItem to="/explore" isfirst={true}>
                Variables
              </BreadcrumbItem>
              <BreadcrumbItem to="/analysis" isfirst={false}>
                Analysis
              </BreadcrumbItem>
              <BreadcrumbItem to="/experiment" isfirst={false}>
                Experiment
              </BreadcrumbItem>
            </Group>
            <DropdownWrapper className="links">{children}</DropdownWrapper>
            <div className="experiment-nav links">
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
      </LogoBreadcrumbs>
      <RightLinks className="experiment-nav right-nav">
        <ShepherdContainer />
        <HelpButton />
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
