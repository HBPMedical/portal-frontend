import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { APIUser, backendURL } from '../API';
import ReactMarkdown from 'react-markdown';

interface Props extends RouteComponentProps<{}> {
  apiUser: APIUser;
}

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

export default ({ ...props }: Props): JSX.Element => {
  const [accepted, setAccepted] = useState(false);
  const [TOS, setTOS] = useState<string | undefined>(undefined);

  useEffect(() => {
    const agreeNDA = props.apiUser.state.user?.agreeNDA;
    if (agreeNDA) {
      props.history.push('/');
    }
  }, [props.apiUser.state, props.history]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await fetch(`${backendURL}/assets/tos.md`);
      const text = await data.text();
      setTOS(text);
    };

    fetchData().catch(error => {
      setTOS('TOS are not available, please contact your administrator');
      console.log(error);
    });
  });

  const handleAcceptTOS = (): void => {
    if (accepted) {
      const { apiUser, history } = props;
      apiUser.acceptTOS().then(() => {
        history.push('/');
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
      {TOS && <ReactMarkdown>{TOS as string}</ReactMarkdown>}
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
          Proceed
        </Button>
      </ContainerBtnRight>
    </Container>
  );
};
