import * as React from 'react';
import { Button, Card, OverlayTrigger, Popover } from 'react-bootstrap';
import styled from 'styled-components';

import { APIModel } from '../API';
import { Algorithm, AlgorithmParameter, VariableEntity } from '../API/Core';

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
  lookup,
  layout = 'default',
  handleSelectMethod,
  apiModel
}: {
  algorithms: Algorithm[] | undefined;
  layout?: string;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
  handleSelectMethod?: (method: Algorithm) => void;
  apiModel: APIModel;
}): JSX.Element => {
  const query = apiModel.state.model?.query;
  const modelVariable =
    (query &&
      query.variables &&
      query.variables.map(v => lookup(v.code, query.pathology))) ||
    [];
  const modelCovariables = [
    ...((query &&
      query.coVariables &&
      query.coVariables.map(v => lookup(v.code, query?.pathology))) ||
      []),
    ...((query &&
      query.groupings &&
      query.groupings.map(v => lookup(v.code, query?.pathology))) ||
      [])
  ];

  const algorithmEnabled = (
    parameters: AlgorithmParameter[],
    { x, y }: { x: VariableEntity[]; y: VariableEntity[] }
  ): boolean => {
    const checkSelectedVariables = (
      axis: string,
      variables: VariableEntity[]
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
