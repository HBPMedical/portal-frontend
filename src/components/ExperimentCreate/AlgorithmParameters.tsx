import React from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import {
  Algorithm,
  Experiment,
  NumberParameter,
  StringParameter
} from '../API/GraphQL/types.generated';
import StringInput from './inputs/StringInput';
import NumberInput from './inputs/NumberInput';

interface Dictionary<T> {
  [Key: string]: T;
}

const Header = styled.div`
  margin-bottom: 16px;

  h4 {
    margin-bottom: 4px;
  }
`;

type Dict = { [key: string]: string };

type Props = {
  experiment: Experiment;
  algorithm?: Algorithm;
  handleParameters?: () => void;
};

const AlgorithmParameters = ({ experiment, algorithm }: Props) => {
  if (!algorithm)
    return (
      <Header>
        <h4>
          <strong>Your algorithm</strong>
        </h4>
        <p>
          Please, select the algorithm to be performed in the &apos;Available
          Algorithms&apos; panel
        </p>
      </Header>
    );
  return (
    <div>
      <Header>
        <h4>
          <strong>{algorithm.label}</strong>
        </h4>
        <p>{algorithm.description}</p>

        <Form validated={true}>
          {algorithm.parameters?.map(param => {
            const type = ((param as unknown) as Dict).__typename;

            if (type === 'StringParameter')
              return <StringInput parameter={param as StringParameter} />;

            if (type === 'NumberParameter')
              return <NumberInput parameter={param as NumberParameter} />;
          })}
        </Form>
      </Header>
    </div>
  );
};

export default AlgorithmParameters;
