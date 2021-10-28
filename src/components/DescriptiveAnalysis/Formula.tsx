import React, { useCallback, useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { VariableEntity } from '../API/Core';
import { IFormula } from '../API/Model';
import styled from 'styled-components';
import { Query } from '../API/Model';
import { FormulaTransformation } from '../API/GraphQL/types.generated';

type Modify<T, R> = Omit<T, keyof R> & R;
type SelectedTransformation = Modify<
  FormulaTransformation,
  {
    name: string | undefined;
    operation: string | undefined;
  }
>;
type SelectedInteraction = string[][];

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

const Formula = ({
  query,
  handleUpdateFormula,
  lookup
}: {
  query?: Query;
  handleUpdateFormula: (formula?: IFormula) => void;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
}) => {
  const [variables, setVariables] = useState<VariableEntity[]>();
  const [formula, setFormula] = useState<IFormula>();
  const [
    selectedTransform,
    setSelectedTransform
  ] = useState<SelectedTransformation | null>();
  const [selectedInteraction, setSelectedInteraction] = useState<
    SelectedInteraction
  >([]);
  const lookupCallback = useCallback(lookup, []);

  useEffect(() => {
    handleUpdateFormula(formula);
  }, [formula, handleUpdateFormula]);

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

    if (query?.formula) {
      setFormula(query.formula);
    }
  }, [query, setVariables, lookupCallback, setFormula]);

  const handleSetTransform = (): void => {
    const transformations = formula?.transformations || null;
    if (selectedTransform?.name && selectedTransform?.operation) {
      setFormula({
        transformations: [
          ...(transformations ? transformations : []),
          selectedTransform as FormulaTransformation
        ]
      });
    }
    setSelectedTransform(null);
  };

  const handleUnsetTransform = (code?: string) => {
    const previousTransformations = formula?.transformations;
    const transformations = previousTransformations?.filter(
      t => t.name !== code
    );
    setFormula({ transformations });
  };

  const handleSaveInteraction = (): void => {
    // const code = selectedInteraction[0];
    // const value = selectedInteraction[1];
    // if (code && value) {
    //   setInteractions({
    //     [code]: value,
    //     ...interactions
    //   });
    // }
    // setSelectedInteraction([]);
  };

  const handleDeleteInteraction = (var1?: string) => {
    // if (!var1) return;
    // const newInteractions = { ...interactions };
    // delete newInteractions[var1];
    // setInteractions(newInteractions);
  };

  const TransformRow = ({
    transformation
  }: {
    transformation?: FormulaTransformation;
  }) => {
    const name = transformation?.name || selectedTransform?.name;
    const operation = transformation?.operation || selectedTransform?.operation;

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
            <Button variant="danger" onClick={() => handleUnsetTransform(name)}>
              x
            </Button>
          )}
        </Form.Group>
      </Form.Row>
    );
  };

  const InteractionRow = ({ var1 }: { var1?: string }) => {
    const key = var1 || selectedInteraction[0];
    const value = selectedInteraction[1];

    return (
      <Form.Row>
        <Form.Group as={Col} controlId="formInteractionVar1">
          <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
          <Form.Control
            as="select"
            disabled={var1 !== undefined}
            value={key}
            onChange={(event: React.FormEvent<any>): void => {
              event.preventDefault();
              const nextCode = (event.target as HTMLInputElement).value;
              // setSelectedInteraction([nextCode, value]);
            }}
          >
            <option>{variableDefault}</option>
            {variables?.map(v => (
              <option key={`interact-${v.code}`} value={v.code}>
                {v.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="formInteractionVar2">
          <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
          <Form.Control
            as="select"
            disabled={var1 !== undefined}
            value={value}
            onChange={(event: React.FormEvent<any>): void => {
              event.preventDefault();
              const var2 = (event.target as HTMLInputElement).value;
              if (var1) {
                handleSaveInteraction();
              } else {
                // setSelectedInteraction([key, var2]);
              }
            }}
          >
            <option>{variableDefault}</option>
            {variables?.map(v => (
              <option key={`interact2-${v.code}`} value={v.code}>
                {v.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          {!var1 && (
            <Button variant="info" onClick={() => handleSaveInteraction()}>
              +
            </Button>
          )}
          {var1 && (
            <Button
              variant="danger"
              onClick={() => handleDeleteInteraction(var1)}
            >
              -
            </Button>
          )}
        </Form.Group>
      </Form.Row>
    );
  };

  const transformationVariables = formula?.transformations || [];
  const interactionVariables = formula?.interactions || [];

  return (
    <Wrapper>
      <h4>Formula</h4>
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

        {(variables?.length || 0) > 1 && (
          <>
            <h5>Interaction terms</h5>
            <p>Pairwise interactions between variables.</p>
            {interactionVariables.length <
              Math.floor((variables?.length || 0) / 2) && (
              <>
                <p>
                  <strong>Add Interaction</strong>
                </p>
                <InteractionRow key={'interactionrow-edit'} />
              </>
            )}
            {/* {interactionVariables.map(interaction => (
            <InteractionRow var1={code} key={`interactionrow-${code}`} />
          ))} */}
          </>
        )}
      </Form>
    </Wrapper>
  );
};

export default Formula;
