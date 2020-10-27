import * as React from 'react';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../../images/hbp-logo.png';
import { ExperimentResponse } from '../API/Experiment';
import MIPContext from '../App/MIPContext';
import Dropdown from './DropdownExperiments';
import HelpButton from './HelpButton';

interface Props {
  isAnonymous: boolean;
  authenticated: boolean;
  handleLoginPress: () => void;
  handleLogoutPress: () => void;
  name?: string;
  experiments?: ExperimentResponse[];
  handleSelect: (experiment: ExperimentResponse) => void;
  datacatalogueUrl: string | undefined;
}

const NavBar = styled.nav`
  position: fixed;
  z-index: 1;
  top: 0;
  width: 100%;
  font-family: 'Open Sans Condensed', sans-serif;
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

  a:link,
  a:visited {
    color: #fff;
    text-decoration: none;
  }

  a:hover,
  a:active {
    color: #ccc;
    text-decoration: none;
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
  display: flex;
  align-items: center;
  // margin-left: auto;

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

const DropdownWrapper = styled.div`
  .dropdown-menu {
    overflow-y: auto;
    height: 400px;
  }
`;

const ALink = styled.a`
  color: white;
  font-size: 16px;
  margin: 0px 16px 0px 0px;
`;

export default ({
  isAnonymous,
  authenticated,
  handleLoginPress,
  handleLogoutPress,
  name,
  datacatalogueUrl,
  experiments,
  handleSelect
}: Props): JSX.Element => {
  const instanceName = name || 'MIP';

  return (
    <NavBar>
      <Brand>
        <Link to="/">
          <div title="Human Brain Project"></div>
        </Link>
        <Link to="/">{instanceName}</Link>
      </Brand>
      <Links>
        {authenticated && (
          <Group>
            <GroupLink to="/explore">Variables</GroupLink>
            <span> &gt; </span>
            <GroupLink to="/review">Analysis</GroupLink>
            <span> &gt; </span>
            <GroupLink to="/experiment">Experiment</GroupLink>
          </Group>
        )}
        {authenticated && (
          <DropdownWrapper>
            <Dropdown
              items={experiments}
              /* eslint-disable-next-line */
              style="link"
              type={'models'}
              title="My Experiments"
              handleSelect={handleSelect}
              handleCreateNewExperiment={null}
            />
          </DropdownWrapper>
        )}
        {authenticated && <Link to="/galaxy">Workflow</Link>}
        {authenticated && datacatalogueUrl && (
          <ALink
            href={datacatalogueUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Data Catalogue
          </ALink>
        )}
      </Links>
      <RightLinks>
        <MIPContext.Consumer>
          {({ toggleTutorial }): JSX.Element =>
            (
              <>
                <Button
                  bsStyle="link"
                  bsSize={'small'}
                  onClick={toggleTutorial}
                >
                  User Guide
                </Button>
              </>
            ) || <></>
          }
        </MIPContext.Consumer>
        <HelpButton showTraining={true} />
        {!isAnonymous && !authenticated && (
          <Button
            onClick={handleLoginPress}
            bsSize={'small'}
            bsStyle={'info'}
            type="submit"
          >
            Login
          </Button>
        )}
        {!isAnonymous && authenticated && (
          <Button
            bsStyle={'warning'}
            bsSize={'small'}
            onClick={handleLogoutPress}
          >
            Logout
          </Button>
        )}
      </RightLinks>
    </NavBar>
  );
};
