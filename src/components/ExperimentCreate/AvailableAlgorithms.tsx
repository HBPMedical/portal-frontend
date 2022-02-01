import * as React from 'react';
import { Button, Card, OverlayTrigger, Popover } from 'react-bootstrap';
import styled from 'styled-components';
import { Algorithm, AlgorithmParameter } from '../API/Core';
import { Experiment, Variable } from '../API/GraphQL/types.generated';

interface AvailableAlgorithm extends Algorithm {
  enabled: boolean;
}

const Container = styled.div`
  var {
    cursor: default;
    font-size: 0.8rem;
    padding: 0,
    text-transform: none
  }
  var::after {
    content: ', ';
  }

  var::last-child::after {
    content: '';
  }

  p {
    margin: 0;
    padding: 0;
    border: 1px solid transparent;
  }
`;

const AvailableAlgorithms = ({
  algorithms,
  layout = 'default',
  experiment,
  handleSelectMethod,
  lookup
}: {
  algorithms: Algorithm[] | undefined;
  layout?: string;
  experiment: Experiment;
  lookup: (id: string) => Variable | undefined;
  handleSelectMethod?: (method: Algorithm) => void;
}): JSX.Element => {
  const modelVariable =
    (experiment.variables && experiment.variables.map(v => lookup(v))).filter(
      (v): v is Variable => !!v
    ) || [];
  const modelCovariables = [
    ...(
      (experiment.coVariables && experiment.coVariables.map(v => lookup(v))) ||
      []
    ).filter((v): v is Variable => !!v)
  ];

  const algorithmEnabled = (
    parameters: AlgorithmParameter[],
    { x, y }: { x: Variable[]; y: Variable[] }
  ): boolean => {
    const checkSelectedVariables = (
      axis: string,
      variables: Variable[]
    ): boolean => {
      const definition = parameters.find(p => p.label === axis);
      if (definition) {
        const isCategorical =
          definition.columnValuesIsCategorical === ''
            ? undefined
            : definition.columnValuesIsCategorical === 'true'
            ? true
            : false;
        // const type = xDefinition.columnValuesSQLType;
        const multiple = definition.valueMultiple === 'true';
        const notBlank = definition.valueNotBlank === 'true';

        if (isCategorical && !variables.every(c => c.type === 'nominal')) {
          return false;
        }

        if (
          isCategorical === false &&
          variables.some(c => c.type === 'nominal')
        ) {
          return false;
        }

        if (notBlank && variables.length === 0) {
          return false;
        }

        // FIXME: not sure if it MUST or SHOULD be multiple
        // Guessing SHOULD now
        if (!multiple && variables.length > 1) {
          return false;
        }

        return true;
      }

      return true;
    };
    // Independant variable check
    return checkSelectedVariables('x', x) && checkSelectedVariables('y', y);
  };

  const availableAlgorithms: AvailableAlgorithm[] =
    algorithms?.map(algorithm => ({
      ...algorithm,
      enabled: algorithmEnabled(algorithm.parameters as AlgorithmParameter[], {
        x: modelCovariables,
        y: modelVariable
      })
    })) || [];

  const variablesHelpMessage = (algorithm: Algorithm): JSX.Element => {
    const message: JSX.Element[] = [];

    const helpFor = (axis: string, term: string): void => {
      const variable = (algorithm.parameters as AlgorithmParameter[]).find(
        p => p.label === axis
      );
      if (variable) {
        if (variable.desc) {
          message.push(
            <p key={`${algorithm.name}-${axis}-desc`}>
              <strong>{term}</strong>: {variable.desc}
            </p>
          );
        } else {
          message.push(
            <p key={`${algorithm.name}-${axis}-desc`}>
              <strong>{term}</strong>
            </p>
          );
        }
      }
    };

    helpFor('y', 'Variable (dependant)');
    helpFor('x', 'Covariable (independant)');

    return <>{message}</>;
  };

  return (
    <Container style={{ lineHeight: layout !== 'inline' ? 'default' : '1.0' }}>
      {availableAlgorithms.map(algorithm => (
        <OverlayTrigger
          key={algorithm.name}
          placement="left"
          rootClose={false}
          overlay={
            <Popover id={`tooltip-${algorithm.name}`}>
              <Card>
                <Card.Body>
                  <h5>{algorithm.label}</h5>
                  <p>{algorithm.desc}</p>
                  {variablesHelpMessage(algorithm)}
                </Card.Body>
              </Card>
            </Popover>
          }
        >
          {layout !== 'inline' ? (
            <div>
              <Button
                key={algorithm.name}
                variant="link"
                // ts lint:disable-next-line jsx-no-lambda
                onClick={(): void =>
                  handleSelectMethod && handleSelectMethod(algorithm)
                }
                disabled={!algorithm.enabled}
                style={{
                  color: algorithm.enabled ? '#007ad9' : 'gray',
                  padding: 0,
                  textTransform: 'none',
                  whiteSpace: 'normal',
                  textAlign: 'left'
                }}
              >
                {algorithm.label || algorithm.name}
              </Button>
            </div>
          ) : (
            <var
              key={algorithm.name}
              style={{
                color: algorithm.enabled ? '#28a745' : 'gray'
              }}
            >
              {algorithm.label || algorithm.name}
            </var>
          )}
        </OverlayTrigger>
      ))}
    </Container>
  );
};
export default AvailableAlgorithms;
