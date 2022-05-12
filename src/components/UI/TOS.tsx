import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import styled from 'styled-components';
import {
  namedOperations,
  useActiveUserQuery,
  useUpdateActiveUserMutation
} from '../API/GraphQL/queries.generated';
import { makeAssetURL } from '../API/RequestURLS';

const Container = styled.div`
  background-color: white;
  padding: 1em;
  margin: 48px;

  .tos-form {
    margin: 48px;
  }
`;

const ContainerBtnRight = styled.div`
  .pull-right {
    float: right;
  }
`;

export default (): JSX.Element => {
  const [accepted, setAccepted] = useState(false);
  const [TOS, setTOS] = useState<string | undefined>(undefined);
  const mountedRef = useRef(true);

  const { loading: userLoading, data } = useActiveUserQuery();

  const history = useHistory();

  const [updateActiveUser, { loading }] = useUpdateActiveUserMutation({
    refetchQueries: [namedOperations.Query.activeUser],
    onCompleted: () => {
      history.push('/');
    }
  });

  useEffect(() => {
    const agreeNDA = data?.user?.agreeNDA;
    if (agreeNDA) {
      history.push('/');
    }
  }, [data, history, userLoading]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await fetch(makeAssetURL('tos.md'));
      const text = await data.text();
      if (mountedRef.current) setTOS(text);
    };

    fetchData().catch(error => {
      if (mountedRef.current)
        setTOS('TOS are not available, please contact your administrator');
      console.log(error);
    });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleAcceptTOS = (): void => {
    if (accepted) {
      updateActiveUser({
        variables: {
          updateUserInput: {
            agreeNDA: true
          }
        }
      });
    }
  };

  const handleCheckboxChange = (event: React.FormEvent): void => {
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    setAccepted(value);
  };

  return (
    <Container>
      {TOS && (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {TOS as string}
        </ReactMarkdown>
      )}
      <ContainerBtnRight className="tos-form">
        <div>
          <Form.Check
            inline={true}
            type="checkbox"
            id={`tos`}
            label={'I accept the Terms of Use.'}
            onChange={handleCheckboxChange}
          ></Form.Check>
        </div>

        <Button
          onClick={handleAcceptTOS}
          disabled={!accepted}
          className="pull-right"
          variant="primary"
          type="submit"
        >
          {loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          {!loading && 'Proceed'}
        </Button>
      </ContainerBtnRight>
    </Container>
  );
};
