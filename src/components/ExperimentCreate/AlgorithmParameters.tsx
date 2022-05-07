import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import {
  Algorithm,
  Experiment,
  NominalParameter,
  NumberParameter,
  StringParameter,
  Variable
} from '../API/GraphQL/types.generated';
import NominalInput from './inputs/NominalInput';
import SimpleInput from './inputs/SimpleInput';

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
  variables?: Variable[];
  handleParameters?: (params: Dict) => void;
};

const AlgorithmParameters = ({
  experiment,
  algorithm,
  variables = [],
  handleParameters
}: Props) => {
  const [params, setParams] = useState<Dict>({});

  useEffect(() => {
    const data =
      algorithm?.parameters?.reduce(
        (prev, param) => ({
          ...prev,
          [param.id]: param.defaultValue
        }),
        {}
      ) ?? {};
    setParams(data);
    console.log('tests');
    //handleParameters?.(data);
  }, [algorithm]);

  const handleParamChanged = (key: string, value: string) => {
    console.log('tests 2');

    setParams(prevState => {
      const newState = {
        ...prevState,
        [key]: value
      };
      //handleParameters?.(newState);
      return newState;
    });
  };

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

        {algorithm.parameters?.length === 0 && <div>No parameters needed</div>}

        <Form validated={true}>
          {algorithm.parameters?.map(param => {
            const type = ((param as unknown) as Dict).__typename;

            if (type === 'StringParameter')
              return (
                <SimpleInput
                  key={param.id}
                  parameter={param as StringParameter}
                  handleValueChanged={handleParamChanged}
                />
              );

            if (type === 'NumberParameter')
              return (
                <SimpleInput
                  key={param.id}
                  parameter={param as NumberParameter}
                  handleValueChanged={handleParamChanged}
                />
              );

            if (type === 'NominalParameter')
              return (
                <NominalInput
                  key={param.id}
                  parameter={param as NominalParameter}
                  experiment={experiment}
                  variables={variables}
                  handleValueChanged={handleParamChanged}
                />
              );
          })}
        </Form>
      </Header>
    </div>
  );
};

export default AlgorithmParameters;
