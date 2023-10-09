/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import styled from 'styled-components';
import {
  Experiment,
  Formula,
  FormulaOperation,
  FormulaTransformation,
  Variable,
} from '../API/GraphQL/types.generated';
import { Dict, IFormula } from '../utils';

type Modify<T, R> = Omit<T, keyof R> & R;
type SelectedTransformation = Modify<
  FormulaTransformation,
  {
    id: string | undefined;
    operation: string | undefined;
  }
>;
type SelectedInteraction = string[];

const variableDefault = 'Variable...';
const operationDefault = 'Operation...';

const Wrapper = styled.div`
  padding: 1em;
  width: 800px;
`;

const InteractionRow = ({
  interaction,
  selectedInteraction,
  variables,
  setSelectedInteraction,
  handleSetInteraction,
  handleUnsetInteraction,
}: {
  interaction?: string[];
  selectedInteraction: SelectedInteraction;
  variables: Variable[];
  setSelectedInteraction: (interaction: SelectedInteraction) => void;
  handleSetInteraction: () => void;
  handleUnsetInteraction: (interactions: string[]) => void;
}): JSX.Element => {
  // Fixed to 2 interactions for now
  const var1 = (interaction && interaction[0]) || selectedInteraction[0];
  const var2 = (interaction && interaction[1]) || selectedInteraction[1];
  return (
    <Form.Row>
      <Form.Group as={Col} controlId="formInteractionVar1">
        <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
        <Form.Control
          as="select"
          disabled={interaction !== undefined}
          value={var1}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const nextCode = (event.target as HTMLInputElement).value;
            setSelectedInteraction([nextCode, selectedInteraction[1]]);
          }}
        >
          <option>{variableDefault}</option>
          {variables?.map((v) => (
            <option
              key={`interact-${v.id}`}
              value={v.id}
              disabled={v.id === selectedInteraction[1]}
            >
              {v.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col} controlId="formInteractionVar2">
        <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
        <Form.Control
          as="select"
          disabled={interaction !== undefined}
          value={var2}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const nextvar2 = (event.target as HTMLInputElement).value;
            setSelectedInteraction([selectedInteraction[0], nextvar2]);
          }}
        >
          <option>{variableDefault}</option>
          {variables?.map((v) => (
            <option
              key={`interact2-${v.id}`}
              value={v.id}
              disabled={v.id === selectedInteraction[0]}
            >
              {v.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col}>
        {interaction === undefined &&
          selectedInteraction[0] &&
          selectedInteraction[1] && (
            <Button variant="info" onClick={() => handleSetInteraction()}>
              +
            </Button>
          )}
        {interaction && (
          <Button
            variant="danger"
            onClick={() => handleUnsetInteraction(interaction)}
          >
            x
          </Button>
        )}
      </Form.Group>
    </Form.Row>
  );
};

const TransformRow = ({
  transformation,
  variables,
  operations,
  selectedTransform,
  formula,
  setSelectedTransform,
  handleSetTransform,
  handleUnsetTransform,
}: {
  transformation?: FormulaTransformation;
  variables: Variable[];
  operations: FormulaOperation[];
  selectedTransform: SelectedTransformation | null | undefined;
  formula?: Formula;
  setSelectedTransform: React.Dispatch<
    React.SetStateAction<SelectedTransformation | null | undefined>
  >;
  handleSetTransform: () => void;
  handleUnsetTransform: (formula: FormulaTransformation) => void;
}): JSX.Element => {
  const name = transformation?.id || selectedTransform?.id;
  const operation = transformation?.operation || selectedTransform?.operation;
  const dictOperations: Dict<string[]> = operations.reduce(
    (p: Dict<string[]>, c) => {
      p[c.variableType] = c.operationTypes;
      return p;
    },
    {}
  );

  return (
    <Form.Row>
      <Form.Group as={Col} controlId="form-transform">
        <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
        <Form.Control
          as="select"
          disabled={transformation?.id !== undefined}
          value={name}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const nextName = (event.target as HTMLInputElement).value;
            setSelectedTransform((prevSelectedTransform) => ({
              id: nextName,
              operation: prevSelectedTransform?.operation,
            }));
          }}
        >
          <option>{variableDefault}</option>
          {variables?.map((v) => (
            <option
              key={`variable-${v.id}`}
              value={v.id}
              disabled={formula?.transformations
                ?.map((t) => t.id)
                .includes(v.id)}
            >
              {v.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col} controlId="formTransformation">
        <Form.Label style={{ display: 'none' }}>Transformations</Form.Label>
        <Form.Control
          as="select"
          disabled={transformation?.operation !== undefined}
          value={operation}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const t = (event.target as HTMLInputElement).value;
            setSelectedTransform((prevSelectedTransform) => ({
              id: prevSelectedTransform?.id,
              operation: t,
            }));
          }}
        >
          <option>{operationDefault}</option>
          {dictOperations[
            variables?.find((v) => v.id === name)?.type?.toLowerCase() ??
              'default'
          ]?.map((f) => (
            <option key={`tranform-${f}`} value={f}>
              {f}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col}>
        {selectedTransform?.id &&
          selectedTransform?.operation &&
          !transformation && (
            <Button variant="info" onClick={(): void => handleSetTransform()}>
              +
            </Button>
          )}
        {transformation && (
          <Button
            variant="danger"
            onClick={(): void => handleUnsetTransform(transformation)}
          >
            x
          </Button>
        )}
      </Form.Group>
    </Form.Row>
  );
};

const FormulaContainer = ({
  handleUpdateFormula,
  lookup,
  availableAlgorithmsWithFormula,
  experiment,
  operations,
}: {
  handleUpdateFormula: (formula?: IFormula) => void;
  lookup: (id: string) => Variable | undefined;
  operations: FormulaOperation[];
  availableAlgorithmsWithFormula?: string[];
  experiment: Experiment;
}): JSX.Element => {
  const [variables, setVariables] = useState<Variable[]>();
  const [selectedTransform, setSelectedTransform] =
    useState<SelectedTransformation | null>();
  const [selectedInteraction, setSelectedInteraction] =
    useState<SelectedInteraction>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lookupCallback = useCallback(lookup, []);

  useEffect(() => {
    const variables: string[] | undefined = experiment && [
      ...(experiment.coVariables || []),
      ...(experiment.variables || []),
    ];

    // Get all non categoricals variables
    const lookedUpVariables =
      (variables
        ?.map((v) => lookupCallback(v))
        .filter((v) => v && !v.enumerations?.length) as Variable[]) ?? [];

    setVariables(lookedUpVariables);
  }, [experiment, setVariables, lookupCallback]);

  const handleSetTransform = (): void => {
    const formula = experiment?.formula;
    const transformations = formula?.transformations || null;
    if (selectedTransform?.id && selectedTransform?.operation) {
      const nextFormula = {
        ...formula,
        transformations: [
          ...(transformations ? transformations : []),
          selectedTransform as FormulaTransformation,
        ],
      };
      handleUpdateFormula(nextFormula);
    }
    setSelectedTransform(null);
  };

  const handleUnsetTransform = (
    transformation?: FormulaTransformation
  ): void => {
    const formula = experiment?.formula;
    const previousTransformations = formula?.transformations;
    const transformations = previousTransformations?.filter(
      (t) => t.id !== transformation?.id
    );
    const nextFormula = {
      ...formula,
      transformations,
    };
    handleUpdateFormula(nextFormula);
  };

  const handleSetInteraction = (): void => {
    const formula = experiment?.formula;
    const interactions = formula?.interactions;
    if (selectedInteraction[0] && selectedInteraction[1]) {
      const nextFormula = {
        ...formula,
        interactions: [
          ...(interactions ? interactions : []),
          [selectedInteraction[0], selectedInteraction[1]],
        ],
      };
      handleUpdateFormula(nextFormula);
    }
    setSelectedInteraction([]);
  };

  const handleUnsetInteraction = (interaction: string[]) => {
    const formula = experiment?.formula;
    const previousInteractions = formula?.interactions;
    const interactions = previousInteractions?.filter(
      (i) => !(i[0] === interaction[0] && i[1] === interaction[1])
    );
    const nextFormula = {
      ...formula,
      interactions,
    };
    handleUpdateFormula(nextFormula);
  };

  const formula = experiment.formula;
  const transformationVariables = formula?.transformations || [];
  const interactionVariables = formula?.interactions || [];

  return (
    <Wrapper>
      {!availableAlgorithmsWithFormula ||
        (availableAlgorithmsWithFormula?.length === 0 && <p></p>)}
      {availableAlgorithmsWithFormula &&
        availableAlgorithmsWithFormula?.length > 0 && (
          <>
            <h4>Formula</h4>
            <p>
              Formula is available for the following algorithms:{' '}
              {availableAlgorithmsWithFormula?.join(', ')}
            </p>
          </>
        )}
      {variables && variables.length > 0 && (
        <Form>
          <h5>Transformations</h5>
          <p>
            Transformation to be applied to a single variable. Examples of
            transformations are mathematical functions (log, exp, center,
            standardize) for numerical variables.
          </p>
          <p>
            <strong>Add Transformation</strong>
          </p>

          {transformationVariables.map((transformation) => (
            <TransformRow
              operations={operations}
              transformation={transformation}
              formula={formula ?? undefined}
              handleSetTransform={handleSetTransform}
              handleUnsetTransform={handleUnsetTransform}
              selectedTransform={selectedTransform}
              setSelectedTransform={setSelectedTransform}
              variables={variables}
              key={`transformations-row-${transformation.id}`}
            />
          ))}

          {transformationVariables.length < (variables?.length || 0) && (
            <TransformRow
              operations={operations}
              formula={formula ?? undefined}
              handleSetTransform={handleSetTransform}
              handleUnsetTransform={handleUnsetTransform}
              selectedTransform={selectedTransform}
              setSelectedTransform={setSelectedTransform}
              variables={variables}
              key={'transformations-row-edit'}
            />
          )}

          {variables && variables.length > 1 && (
            <>
              <h5>Interaction terms</h5>
              <p>Pairwise interactions between variables.</p>
              <p>
                <strong>Add Interaction</strong>
              </p>
              {interactionVariables.map((interaction) => (
                <InteractionRow
                  interaction={interaction}
                  handleSetInteraction={handleSetInteraction}
                  handleUnsetInteraction={handleUnsetInteraction}
                  variables={variables}
                  selectedInteraction={selectedInteraction}
                  setSelectedInteraction={setSelectedInteraction}
                  key={`interaction-row-${interaction.join('-')}`}
                />
              ))}
              {interactionVariables.length <
                Math.floor((variables?.length || 0) / 2) && (
                <InteractionRow
                  handleSetInteraction={handleSetInteraction}
                  handleUnsetInteraction={handleUnsetInteraction}
                  variables={variables}
                  selectedInteraction={selectedInteraction}
                  setSelectedInteraction={setSelectedInteraction}
                  key={'interaction-row-edit'}
                />
              )}
            </>
          )}
        </Form>
      )}
    </Wrapper>
  );
};

export default FormulaContainer;
