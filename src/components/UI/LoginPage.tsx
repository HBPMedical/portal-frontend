import React, { useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { SessionState } from '../../utilities/types';
import { apolloClient } from '../API/GraphQL/apollo.config';
import { localMutations } from '../API/GraphQL/operations/mutations';
import {
  useActiveUserQuery,
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
  const history = useHistory();

  useActiveUserQuery({
    onCompleted: data => {
      // Done only if user is logged in
      history.push('/');
    }
  });

  const [loginMutation, { loading }] = useLoginMutation({
    onCompleted: async () => {
      toast.success('You successfully logged in');
      history.push('/');
      await apolloClient.resetStore();
      localMutations.user.setState(SessionState.LOGGED_IN);
    },
    refetchQueries: 'active',
    onError: data => {
      if (data.graphQLErrors) {
        for (const err of data.graphQLErrors) {
          switch (err.extensions?.code || 'unknown') {
            case 'UNAUTHENTICATED':
              toast.error('Invalid login or password.');
              break;
            default:
              toast.error('Error when trying to login, please try later.');
              console.log(err);
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
    handleLogin();
  };

  return (
    <Container>
      <CardContainer>
        <form onSubmit={loginSubmit}>
          <h3>Login In</h3>
          <div className="form-group"></div>
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
