import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Algorithm, VariableEntity } from '../API/Core';
import { FormulaTransformation } from '../API/GraphQL/types.generated';
import { IFormula, Query } from '../API/Model';

type Modify<T, R> = Omit<T, keyof R> & R;
type SelectedTransformation = Modify<
  FormulaTransformation,
  {
    name: string | undefined;
    operation: string | undefined;
  }
>;
type SelectedInteraction = string[];

const variableDefault = 'Variable...';
const operationDefault = 'Operation...';

// TODO: expose in backend
const operations = {
  real: ['log', 'exp', 'center', 'standardize'],
  nominal: ['dummy', 'poly', 'contrast', 'additive']
};

const Wrapper = styled.div`
  padding: 1em;
  width: 800px;
`;

const Formula = React.memo(
  ({
    query,
    handleUpdateFormula,
    lookup,
    availableAlgorithms
  }: {
    query?: Query;
    handleUpdateFormula: (formula?: IFormula) => void;
    lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
    availableAlgorithms?: Algorithm[];
  }) => {
    const [variables, setVariables] = useState<VariableEntity[]>();
    const [
      selectedTransform,
      setSelectedTransform
    ] = useState<SelectedTransformation | null>();
    const [selectedInteraction, setSelectedInteraction] = useState<
      SelectedInteraction
    >([]);
    const lookupCallback = useCallback(lookup, []);
    const handleUpdateFormulaCallback = useCallback(handleUpdateFormula, []);

    useEffect(() => {
      handleUpdateFormulaCallback(undefined); // set initial state to nothing
    }, [handleUpdateFormulaCallback]);

    useEffect(() => {
      const variables: VariableEntity[] | undefined = query && [
        ...(query.coVariables || []),
        ...(query.variables || []),
        ...(query.groupings || [])
      ];

      // Get all non categoricals variables
      const lookedUpVariables = variables
        ?.map(v => lookupCallback(v.code, query?.pathology))
        .filter(v => !v.isCategorical);

      setVariables(lookedUpVariables);
    }, [query, setVariables, lookupCallback]);

    const handleSetTransform = (): void => {
      const formula = query?.formula;
      const transformations = formula?.transformations || null;
      if (selectedTransform?.name && selectedTransform?.operation) {
        const nextFormula = {
          ...formula,
          transformations: [
            ...(transformations ? transformations : []),
            selectedTransform as FormulaTransformation
          ]
        };
        handleUpdateFormula(nextFormula);
      }
      setSelectedTransform(null);
    };

    const handleUnsetTransform = (transformation?: FormulaTransformation) => {
      const formula = query?.formula;
      const previousTransformations = formula?.transformations;
      const transformations = previousTransformations?.filter(
        t => t.name !== transformation?.name
      );
      const nextFormula = {
        ...formula,
        transformations
      };
      handleUpdateFormula(nextFormula);
    };

    const handleSetInteraction = (): void => {
      const formula = query?.formula;
      const interactions = formula?.interactions;
      if (selectedInteraction[0] && selectedInteraction[1]) {
        const nextFormula = {
          ...formula,
          interactions: [
            ...(interactions ? interactions : []),
            [selectedInteraction[0], selectedInteraction[1]]
          ]
        };
        handleUpdateFormula(nextFormula);
      }
      setSelectedInteraction([]);
    };

    const handleUnsetInteraction = (interaction: string[]) => {
      const formula = query?.formula;
      const previousInteractions = formula?.interactions;
      const interactions = previousInteractions?.filter(
        i => !(i[0] === interaction[0] && i[1] === interaction[1])
      );
      const nextFormula = {
        ...formula,
        interactions
      };
      handleUpdateFormula(nextFormula);
    };

    const TransformRow = ({
      transformation
    }: {
      transformation?: FormulaTransformation;
    }) => {
      const name = transformation?.name || selectedTransform?.name;
      const operation =
        transformation?.operation || selectedTransform?.operation;

      return (
        <Form.Row>
          <Form.Group as={Col} controlId="form-transform">
            <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
            <Form.Control
              as="select"
              disabled={transformation?.name !== undefined}
              value={name}
              onChange={(event: React.FormEvent<any>): void => {
                event.preventDefault();
                const nextName = (event.target as HTMLInputElement).value;
                setSelectedTransform(prevSelectedTransform => ({
                  name: nextName,
                  operation: prevSelectedTransform?.operation
                }));
              }}
            >
              <option>{variableDefault}</option>
              {variables?.map(v => (
                <option
                  key={`variable-${v.code}`}
                  value={v.code}
                  disabled={formula?.transformations
                    ?.map(t => t.name)
                    .includes(v.code)}
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
                setSelectedTransform(prevSelectedTransform => ({
                  name: prevSelectedTransform?.name,
                  operation: t
                }));
              }}
            >
              <option>{operationDefault}</option>
              {operations[
                variables?.find(v => v.code === name)?.type === 'nominal'
                  ? 'nominal'
                  : 'real'
              ]?.map(f => (
                <option key={`tranform-${f}`} value={f}>
                  {f}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col}>
            {selectedTransform?.name &&
              selectedTransform?.operation &&
              !transformation && (
                <Button variant="info" onClick={() => handleSetTransform()}>
                  +
                </Button>
              )}
            {transformation && (
              <Button
                variant="danger"
                onClick={() => handleUnsetTransform(transformation)}
              >
                x
              </Button>
            )}
          </Form.Group>
        </Form.Row>
      );
    };

    const InteractionRow = ({ interaction }: { interaction?: string[] }) => {
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
              {variables?.map(v => (
                <option
                  key={`interact-${v.code}`}
                  value={v.code}
                  disabled={v.code === selectedInteraction[1]}
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
              {variables?.map(v => (
                <option
                  key={`interact2-${v.code}`}
                  value={v.code}
                  disabled={v.code === selectedInteraction[0]}
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

    const formula = query?.formula;
    const transformationVariables = formula?.transformations || [];
    const interactionVariables = formula?.interactions || [];

    return (
      <Wrapper>
        <h4>Formula</h4>
        <p>
          The formula is available for the following algorithms:{' '}
          {availableAlgorithms?.map(a => a.label).toString()}
        </p>
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

            {transformationVariables.map(transformation => (
              <TransformRow
                transformation={transformation}
                // eslint-disable-next-line
                key={`transformations-row-${transformation.name}`}
              />
            ))}

            {transformationVariables.length < (variables?.length || 0) && (
              <TransformRow key={'transformations-row-edit'} />
            )}

            {variables && variables.length > 1 && (
              <>
                <h5>Interaction terms</h5>
                <p>Pairwise interactions between variables.</p>
                <p>
                  <strong>Add Interaction</strong>
                </p>
                {interactionVariables.map(interaction => (
                  <InteractionRow
                    interaction={interaction}
                    // eslint-disable-next-line
                    key={`interaction-row-${interaction.join('-')}`}
                  />
                ))}
                {interactionVariables.length <
                  Math.floor((variables?.length || 0) / 2) && (
                  <InteractionRow key={'interaction-row-edit'} />
                )}
              </>
            )}
          </Form>
        )}
      </Wrapper>
    );
  }
);

export default Formula;
