import * as React from 'react';
import { Button, Carousel, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import MIPContext from '../App/MIPContext';
import start from './0.png';
import one from './1.png';
import two from './2.png';
import three from './3.png';
import four from './4.png';
import five from './5.png';
import six from './6.png';
import seven from './7.png';
import eight from './8.png';
import nine from './9.png';
import ten from './10.png';
import eleven from './11.png';

const Title = styled.h3`
  color: black;
`;

const Text = styled.p`
  color: black;
`;

export default React.memo(
  (): JSX.Element => {
    const [width, height] = [1200, 675];
    const slides = [
      one,
      two,
      three,
      four,
      five,
      six,
      seven,
      eight,
      nine,
      ten,
      eleven
    ];

    return (
      <div className="static-modal">
        <MIPContext.Consumer>
          {({ toggleTutorial }): JSX.Element => (
            <Modal.Dialog>
              <Modal.Header
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Modal.Title>MIP User Guide</Modal.Title>
                <Button
                  bsClass="close"
                  onClick={toggleTutorial}
                  style={{ marginLeft: 'auto' }}
                >
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Close</span>
                </Button>
              </Modal.Header>
              <Modal.Body>
                <Carousel>
                  <Carousel.Item>
                    <img
                      width={width}
                      height={height}
                      alt="Mip User Guide"
                      src={start}
                    />
                    <Carousel.Caption>
                      <Text>
                        Basic skills to start working with the MIP and conduct
                        initial experiments
                      </Text>
                    </Carousel.Caption>
                  </Carousel.Item>

                  {slides.map((s, i) => (
                    <Carousel.Item key={`slide-${i}`}>
                      <img
                        width={width}
                        height={height}
                        alt="Variables"
                        src={s}
                      />
                    </Carousel.Item>
                  ))}

                  <Carousel.Item>
                    <img
                      width={width}
                      height={height}
                      alt="Variables"
                      src={start}
                    />
                    <Carousel.Caption>
                      <Title>More ?</Title>
                      <Text>You can watch the videos </Text>
                      <Text>
                        Document created based on{' '}
                        <Link to="/training"> MIP video tutorials</Link>
                      </Text>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={toggleTutorial}>Close</Button>
              </Modal.Footer>
            </Modal.Dialog>
          )}
        </MIPContext.Consumer>
      </div>
    );
  }
);
