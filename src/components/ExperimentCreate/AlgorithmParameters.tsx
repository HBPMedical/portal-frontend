import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import {
  Algorithm,
  Experiment,
  NominalParameter,
  NumberParameter,
  StringParameter,
  Variable,
} from '../API/GraphQL/types.generated';
import { Dict } from '../utils';
import NominalInput from './inputs/NominalInput';
import SimpleInput from './inputs/SimpleInput';

const Header = styled.div`
  margin-bottom: 16px;

  h4 {
    margin-bottom: 4px;
  }
`;

type Props = {
  experiment: Experiment;
  algorithm?: Algorithm;
  variables?: Variable[];
  handleParameterChange: (key: string, value?: string) => void;
};

const AlgorithmParameters = ({
  experiment,
  algorithm,
  variables = [],
  handleParameterChange,
}: Props) => {
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

        {algorithm.parameters?.length !== 0 && (
          <Form validated={true}>
            {algorithm.parameters
              ?.map((param) => {
                const type = (param as unknown as Dict).__typename;
                const id = `${algorithm.id}-${param.name}`;

                if (type === 'StringParameter' || type === 'NumberParameter')
                  return (
                    <SimpleInput
                      key={id}
                      parameter={
                        type === 'StringParameter'
                          ? (param as StringParameter)
                          : (param as NumberParameter)
                      }
                      handleValueChanged={handleParameterChange}
                    />
                  );

                if (type === 'NominalParameter')
                  return (
                    <NominalInput
                      key={id}
                      parameter={param as NominalParameter}
                      experiment={experiment}
                      variables={variables}
                      handleValueChanged={handleParameterChange}
                    />
                  );

                return undefined;
              })
              .filter((input) => input !== undefined)}
          </Form>
        )}
      </Header>
    </div>
  );
};

export default AlgorithmParameters;
