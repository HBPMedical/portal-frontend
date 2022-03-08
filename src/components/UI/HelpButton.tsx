import { useReactiveVar } from '@apollo/client';
import * as React from 'react';
import { DropdownButton } from 'react-bootstrap';
import { BsBook, BsFillEnvelopeFill, BsFilm } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { configurationVar } from '../API/GraphQL/cache';

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
      color: #007bff !important;
      font-size: 0.9rem;

      :hover {
        color: #0056b3 !important;
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
      color: #5bc0de !important;
    }

    :hover {
      border: 0;
      color: #ccc !important;
    }
  }
`;

export default ({ showTraining }: { showTraining?: boolean }): JSX.Element => {
  const config = useReactiveVar(configurationVar);

  return (
    <MainBox>
      <DropdownButton variant="link" id={'help-dropdown'} title={'Help'}>
        <p>
          <a
            href="https://mip.ebrains.eu/documentation/"
            // tslint:disable-next-line jsx-no-lambda
            onSelect={(): void => {
              window.open('https://mip.ebrains.eu/documentation/');
            }}
          >
            <BsBook /> MIP Documentation
          </a>
        </p>
        {showTraining && (
          <p>
            <NavLink to="/training">
              <BsFilm /> MIP Training
            </NavLink>
          </p>
        )}
        {config.contactLink && (
          <p>
            <a href={config.contactLink}>
              <BsFillEnvelopeFill /> Support
            </a>
          </p>
        )}
      </DropdownButton>
    </MainBox>
  );
};
