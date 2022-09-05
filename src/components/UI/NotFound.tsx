import * as React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 144px;
  height: 100vh;
  color: white;
  width: 100%;
  display: flex;
  align-items: center;
  background-size: cover;
  justify-content: center;
`;

const NotFound = () => <Title>404 Not Found</Title>;

export default NotFound;
