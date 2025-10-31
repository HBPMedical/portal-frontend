import React from 'react';
import { RingLoader } from 'react-spinners';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  font-family: sans-serif;
  display: flex;
  align-items: center;
`;

const RingLoaderWrapper = styled.div`
  padding: 0 8px 4px 0;
`;

const TextWrapper = styled.p`
  color: #2b33e9;
  margin: auto 0;
`;

interface Props {
  visible?: boolean;
}
const Loader = ({ visible }: Props) => (
  <LoaderWrapper>
    <RingLoaderWrapper>
      <RingLoader
        sizeUnit={'px'}
        size={16}
        color={'#2b33e9'}
        loading={visible ?? true}
      />
    </RingLoaderWrapper>
    <TextWrapper>loading...</TextWrapper>
  </LoaderWrapper>
);

export default Loader;
