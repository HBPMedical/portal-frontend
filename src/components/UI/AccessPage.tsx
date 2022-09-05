import { useEffect, useRef, useState } from 'react';
import { Container, Jumbotron } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import rehypeRaw from 'rehype-raw';
import styled from 'styled-components';
import { makeAssetURL } from '../API/RequestURLS';
import Loader from './Loader';

const StyledContainer = styled(Container)`
  margin: 16px auto 0 auto;
  display: flex;
  flex-direction: row;
  padding: 0;
  @media (min-width: 1400px) {
    max-width: 930px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledJumbotron = styled(Jumbotron)`
  margin-bottom: 0;
  border-radius: 0;
  flex: 2;
  background-color: #ffffffaa;
  border-right: 1px solid #ddd;
  font-size: 1.25em;
`;

const AccessPage = () => {
  const [text, setText] = useState<string | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await fetch(makeAssetURL('login.md'));
      const text = await data.text();

      if (mountedRef.current) setText(text); // check if component is still mounted before setting state
    };

    fetchData().catch((error) => {
      if (mountedRef.current)
        toast.error(
          'A problem occurred when fetching data from the server, please contact your administrator'
        );
      setText('A problem occurred when contacting the server.');
      console.log(error);
    });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <StyledContainer>
      <StyledJumbotron>
        {text && (
          <ReactMarkdown rehypePlugins={[rehypeRaw]} linkTarget={'_blank'}>
            {text}
          </ReactMarkdown>
        )}
        {!text && <Loader />}
      </StyledJumbotron>
    </StyledContainer>
  );
};

export default AccessPage;
