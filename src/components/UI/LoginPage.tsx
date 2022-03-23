import React, { useState } from 'react';
import { Alert, Button, Card, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  namedOperations,
  useLoginMutation
} from '../API/GraphQL/queries.generated';

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
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const history = useHistory();

  const [loginMutation, { loading }] = useLoginMutation({
    onCompleted: () => {
      window.location.href = '/';
      //history.replace('/');
    },
    refetchQueries: [
      namedOperations.Query.activeUser,
      namedOperations.Query.listDomains
    ],
    onError: data => {
      if (data.graphQLErrors) {
        for (const err of data.graphQLErrors) {
          switch (err.extensions?.code || 'unknown') {
            case 'UNAUTHENTICATED':
              setErrorMsg('Invalid login or password.');
              break;
            default:
              setErrorMsg('Error when trying to login, please try later.');
              console.log(err.message);
              break;
          }
        }
      }
    }
  });

  const handleLogin = () => {
    loginMutation({
      variables: { username, password }
    });
  };

  const loginSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg('');
    handleLogin();
  };

  return (
    <Container>
      <CardContainer>
        <form onSubmit={loginSubmit}>
          <h3>Login In</h3>
          <div className="form-group">
            {errorMsg && (
              <Alert
                variant="danger"
                onClose={() => setErrorMsg('')}
                dismissible
              >
                {errorMsg}
              </Alert>
            )}
          </div>
          <div className="form-group">
            <label>Username or email</label>
            <input
              type="text"
              className="form-control"
              onChange={event => setUsername(event.target.value)}
              required={true}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              onChange={event => setPassword(event.target.value)}
            />
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
