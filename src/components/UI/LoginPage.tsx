import React, { useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { useLoginMutation } from '../API/GraphQL/queries.generated';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled(Card)`
  margin-top: 20vh;
  padding: 30px;
  border-radius: 10px;
  width: 500px;

  & h3 {
    margin-bottom: 20px;
  }
`;

export default () => {
  const [username, setUsername] = useState<string>('');
  const [passowrd, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [loginMutation, { data, loading, error }] = useLoginMutation();

  const handleLogin = () => {
    // call mutation
  };

  const loginSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Container>
      <CardContainer>
        <form onSubmit={loginSubmit}>
          <h3>Login In</h3>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              onChange={event => setUsername(event.target.value)}
              required={true}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={event => setPassword(event.target.value)}
            />
          </div>
          <div className="form-group">
            <small className="form-text text-danger">{errorMsg}</small>
          </div>

          <Button type="submit" className="btn-block">
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            {!loading && 'Submit'}
          </Button>
        </form>
      </CardContainer>
    </Container>
  );
};
