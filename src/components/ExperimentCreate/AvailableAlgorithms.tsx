import React from 'react';
import { Card, OverlayTrigger, Popover } from 'react-bootstrap';
import styled from 'styled-components';
import { useListAlgorithmsQuery } from '../API/GraphQL/queries.generated';
import {
  Algorithm,
  Experiment,
  Variable,
  VariableParameter,
} from '../API/GraphQL/types.generated';
import Loader from '../UI/Loader';

const Container = styled.div`
  line-height: 15px;

  .algorithms {
    .algorithm {
      cursor: default;
      color: grey;
      &.selected {
        font-weight: bold;
      }
    }
    &.clickable {
      .algorithm.enabled {
        cursor: pointer;
      }
    }
    &.vertical {
      display: flex;
      flex-direction: column;
      .algorithm {
        margin-bottom: 10px;
        font-size: 0.9rem;
        &.enabled {
          color: #2b33e9;
          font-weight: bold;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    &.horizontal {
      .algorithm {
        font-size: 0.8rem;
        font-style: italic;
        &.enabled {
          color: #2b33e9;
          font-weight: bold;
        }
        &::after {
          content: ', ';
        }
        &:last-child::after {
          content: '';
        }
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
  if (!validator) return true;
  if (vars.length === 0) return !validator.isRequired;

  const filtered = vars.filter(
    (v, i) =>
      (!validator.allowedTypes ||
        validator.allowedTypes?.includes(v.type ?? '')) &&
      (validator.hasMultiple || i === 0)
  );

  return filtered.length === vars.length;
};

type Props = {
  experiment: Experiment;
  selectedAlgorithm?: Algorithm;
  direction?: 'horizontal' | 'vertical';
  handleSelect?: (algo: Algorithm) => void;
  listVariables: Variable[];
};

export const AvailableAlgorithms = ({
  direction = 'horizontal',
  handleSelect,
  experiment,
  listVariables,
  selectedAlgorithm,
}: Props) => {
  const isClickable = !!handleSelect;
  const { data, loading } = useListAlgorithmsQuery();
  const variables = experiment.variables
    .map((id) => listVariables.find((v) => v.id === id))
    .filter((v) => v)
    .map((v) => v as Variable);
  const coVariables = (
    experiment.coVariables?.map((id) =>
      listVariables.find((v) => v.id === id)
    ) ?? []
  )
    .filter((v) => v)
    .map((v) => v as Variable);

  const algorithms =
    data?.algorithms
      .map((algo) => {
        return {
          ...algo,
          label: (algo.label ?? algo.id).trim(),
          isEnabled:
            checkValidity(algo.variable, variables) &&
            checkValidity(algo.coVariable, coVariables),
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label)) ?? [];

  if (loading) return <Loader />;

  return (
    <Container>
      <div
        className={`algorithms ${direction} ${isClickable ? 'clickable' : ''}`}
      >
        {algorithms.map((algo) => (
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
                        {algo.variable.allowedTypes && (
                          <>
                            <br />
                            <small
                              color="grey"
                              className="font-italic text-muted"
                            >
                              Allowed types :{' '}
                              {algo.variable.allowedTypes.join(', ')}
                            </small>
                          </>
                        )}
                      </p>
                    )}
                    {algo.coVariable && (
                      <p>
                        <strong>Covariate (independant)</strong>:{' '}
                        {algo.coVariable.hint ?? 'N/A'}
                        {algo.coVariable.allowedTypes && (
                          <>
                            <br />
                            <small
                              color="grey"
                              className="font-italic text-muted"
                            >
                              Allowed types :{' '}
                              {algo.coVariable.allowedTypes.join(', ')}
                            </small>
                          </>
                        )}
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </PopoverContainer>
            }
          >
            <span
              className={`algorithm ${
                algo.isEnabled ? 'enabled' : 'disabled'
              } ${
                selectedAlgorithm && selectedAlgorithm.id === algo.id
                  ? 'selected'
                  : ''
              }`}
              key={algo.id}
              onClick={() => {
                if (handleSelect && algo.isEnabled) {
                  handleSelect(algo as Algorithm);
                }
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
