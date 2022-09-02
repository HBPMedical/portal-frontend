import * as React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const Title = styled.h3`
  margin: 16px 0;
`;

const VideosContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Video = styled.iframe`
  margin: 0 16px 32px 0;
`;

const Videos = (): JSX.Element => (
  <>
    <Card>
      <Card.Body>
        <Title>Videos Training</Title>
        <p>
          Basic skills to start working with the MIP and conduct initial
          experiments
        </p>
      </Card.Body>
    </Card>
    <Card>
      <Card.Body>
        <article>
          <VideosContainer>
            <Video
              title="01 First steps in the MIP"
              src="https://player.vimeo.com/video/387925204"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>

            <Video
              title="02 How to select variables"
              src="https://player.vimeo.com/video/387925216"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>
            <Video
              title="03 How to analyse the variables"
              src="https://player.vimeo.com/video/387925238"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>

            <Video
              title="04 How to filter and save a variable"
              src="https://player.vimeo.com/video/387925256"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>

            <Video
              title="05 How to perform an independent T-Test"
              src="https://player.vimeo.com/video/387925276"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>

            <Video
              title="06 How to perform ANOVA"
              src="https://player.vimeo.com/video/387926320"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>

            <Video
              title="07 How to perform a linear regression"
              src="https://player.vimeo.com/video/387926353"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>

            <Video
              title="09 How to perform pearson correlation"
              src="https://player.vimeo.com/video/387926382"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
            ></Video>
          </VideosContainer>
        </article>
      </Card.Body>
    </Card>
  </>
);

export default Videos;
