import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { OverlayTrigger, Popover, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { variablesVar } from '../API/GraphQL/cache';
import { useListAlgorithmsQuery } from '../API/GraphQL/queries.generated';
import {
  Experiment,
  Variable,
  VariableParameter
} from '../API/GraphQL/types.generated';
import Loader from '../UI/Loader';

const Container = styled.div`
  line-height: 15px;

  .algorithms {
    .algorithm {
      cursor: default;
      font-size: 0.8rem;
      font-style: italic;
      color: grey;
      &.clickable {
        cursor: pointer;
      }
      &.enabled {
        color: green;
      }
      &::after {
        content: ', ';
      }
      &:last-child::after {
        content: '';
      }
    }
  }
`;

const PopoverContainer = styled(Popover)`
  .card {
    margin-bottom: 0px;
  }
`;

const checkValidity = (
  validator: VariableParameter | null | undefined,
  vars: Variable[]
): boolean => {
  if (!validator || !validator.isRequired) return true;
  if (vars.length === 0) return false;

  const filtered = vars.filter(
    (v, i) =>
      validator.allowedTypes?.includes(v.type ?? '') &&
      (validator.hasMultiple || i === 0)
  );

  return filtered.length === vars.length;
};

type Props = {
  experiment: Experiment;
  direction?: 'horizontal' | 'vertical';
  handleSelect?: (id: string) => void;
};

export const AvailableAlgorithms = ({
  direction = 'horizontal',
  handleSelect,
  experiment
}: Props) => {
  const isClickable = !!handleSelect;
  const listVariables = useReactiveVar(variablesVar);
  const { data, loading } = useListAlgorithmsQuery();
  const variables = experiment.variables
    .map(id => listVariables.find(v => v.id === id))
    .filter(v => v)
    .map(v => v as Variable);
  const coVariables = (
    experiment.coVariables?.map(id => listVariables.find(v => v.id === id)) ??
    []
  )
    .filter(v => v)
    .map(v => v as Variable);

  const algorithms =
    data?.algorithms
      .map(algo => {
        return {
          ...algo,
          label: (algo.label ?? algo.id).trim(),
          isEnabled:
            checkValidity(algo.variable, variables) &&
            checkValidity(algo.coVariable, coVariables)
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label)) ?? [];

  console.log(algorithms);

  if (loading) return <Loader />;

  return (
    <Container className={isClickable ? 'clickable' : ''}>
      <div className="algorithms">
        {algorithms.map(algo => (
          <OverlayTrigger
            key={algo.id}
            placement="left"
            rootClose={false}
            overlay={
              <PopoverContainer id={`tooltip-${algo.label}`}>
                <Card>
                  <Card.Body>
                    <h5>{algo.label}</h5>
                    <p>{algo.description}</p>
                    {algo.variable && (
                      <p>
                        <strong>Variable (dependant)</strong>:{' '}
                        {algo.variable.hint}
                      </p>
                    )}
                    {algo.coVariable && (
                      <p>
                        <strong>Covariable (independant)</strong>:{' '}
                        {algo.coVariable.hint ?? 'N/A'}
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </PopoverContainer>
            }
          >
            <span
              className={`algorithm ${algo.isEnabled ? 'enabled' : 'disabled'}`}
              key={algo.id}
              onClick={() => {
                handleSelect?.(algo.id);
              }}
            >
              {algo.label ?? algo.id}
            </span>
          </OverlayTrigger>
        ))}
      </div>
    </Container>
  );
};

export default AvailableAlgorithms;
