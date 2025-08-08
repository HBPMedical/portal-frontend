import { useReactiveVar } from '@apollo/client';
import { DropdownButton } from 'react-bootstrap';
import { BsBook, BsFillEnvelopeFill } from 'react-icons/bs';
import styled from 'styled-components';
import { appConfigVar } from '../API/GraphQL/cache';
import { NavLink } from 'react-router-dom';

const MainBox = styled.div`
  .dropdown-menu {
    right: 0;
    left: auto;
    width: fit-content !important;
    max-height: none;
    overflow-y: auto;
    padding: 0.8em;
    min-width: 200px;
    font-family: apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 1rem;

    label,
    .btn {
      font-weight: normal !important;
    }

    p {
      margin: 0;
    }

    p > a {
      font-family: 'Open Sans', sans-serif;
      font-weight: normal !important;
      padding: 0.5em;
      font-size: 0.9rem;

      :hover {
        text-decoration: underline;
      }
    }

    svg {
      margin-right: 4px;
      margin-top: -2px;
      color: black;
    }
  }

  .btn-link,
  .btn {
    font-weight: bold !important;
    border: 0;
    text-decoration: none;
    box-shadow: none;

    :active {
      border: 0;
    }

    :hover {
      border: 0;
      text-decoration-line: underline;
    }
  }
`;

const Link = styled(NavLink)`
  font-family: 'Open Sans', sans-serif;
  font-weight: normal !important;
  padding: 0.5em;
  // color: #007bff !important;
  font-size: 0.9rem;
  :hover {
    text-decoration: underline !important;
  }
`;

const HelpButton = (): JSX.Element => {
  const config = useReactiveVar(appConfigVar);

  return (
    <MainBox>
      <DropdownButton variant="link" id={'help-dropdown'} title={'Help'}>
        <p>
          <a
            href="https://github.com/HBPMedical/mip-docs"
            target="_blank"
            rel="noreferrer noopener"
          >
            <BsBook /> MIP Documentation
          </a>
        </p>
        {config.contactLink && (
          <p>
            <a href={config.contactLink}>
              <BsFillEnvelopeFill /> Support
            </a>
          </p>
        )}
        <Link to="/tos?view">
          {' '}
          <BsBook /> Terms of service
        </Link>
      </DropdownButton>
    </MainBox>
  );
};

export default HelpButton;
