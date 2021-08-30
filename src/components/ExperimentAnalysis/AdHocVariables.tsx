import React, { useCallback, useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { VariableEntity } from '../API/Core';

import styled from 'styled-components';
import { Query } from '../API/Model';

const variableDefault = 'Variables...';
const transformationDefault = 'Transformations...';

const transformations = {
  real: ['log', 'exp', 'center', 'standardize'],
  nominal: ['dummy', 'poly', 'contrast', 'additive']
};


interface IAdHocVariables {
  [key: string]: string; // variable code as key, transform as value
}

type IAdHocVariable = [string?, string?];

interface Interactions {
  [key: string]: string; // var1 as key, var2 as value
}

type Interaction = [string?, string?];

// TODO: constant factor

const Wrapper = styled.div`
  padding: 1em;
  width: 800px;
`;

const AdHocVariable = ({
  query,
  lookup
}: {
  query?: Query;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
}) => {
  const [variables, setVariables] = useState<VariableEntity[]>();
  const [adhocVariable, setAdhocVariable] = useState<IAdHocVariable>([]);
  const [adhocVariables, setAdhocVariables] = useState<IAdHocVariables>({});
  const [interaction, setInteraction] = useState<Interaction>([]);
  const [interactions, setInteractions] = useState<Interactions>({});
  const lookupCallback = useCallback(lookup, []);

  // Debug
  useEffect(() => {
    console.log(adhocVariables);
  }, [adhocVariables]);

  // Get all variables
  useEffect(() => {
    const variables: VariableEntity[] | undefined = query && [
      ...(query.groupings || []),
      ...(query.coVariables || []),
      ...(query.variables || [])
    ];

    const lookedUpVariables = variables?.map(v =>
      lookupCallback(v.code, query?.pathology)
    );
    setVariables(lookedUpVariables);
  }, [query, setVariables, lookupCallback]);

  // Adhoc Variables functions [{ code: transform }]
  const handleSaveAdhocVariable = (): void => {
    const code = adhocVariable[0]
    const value = adhocVariable[1]
    if (code && value) {
      setAdhocVariables({

        [code]: value,
        ...adhocVariables,
      });
    }
    setAdhocVariable([])
  };

  const handleDeleteAdhocVariable = (code?: string) => {
    if (!code) return;
    const newAdhocs = { ...adhocVariables };
    delete newAdhocs[code];
    setAdhocVariables(newAdhocs);
  };

  // Interactions functions [{ code: transform }]
  const handleSaveInteraction = (): void => {
    const code = interaction[0]
    const value = interaction[1]
    if (code && value) {
      setInteractions({

        [code]: value,
        ...interactions,
      });
    }
    setInteraction([])
  };

  const handleDeleteInteraction = (var1?: string) => {
    if (!var1) return;
    const newInteractions = { ...interactions };
    delete newInteractions[var1];
    setInteractions(newInteractions);
  };

  const AdHocRow = ({ code }: { code?: string }) => {
    const key = code || adhocVariable[0]
    const value = (code && adhocVariables[code]) || adhocVariable[1]

    return (
      <Form.Row>
        <Form.Group as={Col} controlId="formVariable">
          <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
          <Form.Control
            as="select"
            disabled={code !== undefined}
            value={key}
            onChange={(event: React.FormEvent<any>): void => {
              event.preventDefault();
              const nextCode = (event.target as HTMLInputElement).value;
              setAdhocVariable([nextCode, value]);
            }}
          >
            <option>{variableDefault}</option>
            {variables?.map(v => (
              <option value={v.code}>{v.label}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="formTransformation">
          <Form.Label style={{ display: 'none' }}>Transformations</Form.Label>
          <Form.Control
            as="select"
            disabled={code !== undefined}
            value={value}
            onChange={(event: React.FormEvent<any>): void => {
              event.preventDefault();
              const t = (event.target as HTMLInputElement).value;
              if (code) {
                handleSaveAdhocVariable()
              } else {
                setAdhocVariable([key, t]);
              }

            }}
          >
            <option>{transformationDefault}</option>
            {transformations[
              variables?.find(v => v.code === key)?.type === 'nominal'
                ? 'nominal'
                : 'real'
            ]?.map(f => (
              <option value={f}>{f}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col}>
          {!code && (
            <Button
              variant="info"
              onClick={() => handleSaveAdhocVariable()}
            >
              +
            </Button>
          )}
          {code && (
            <Button
              variant="danger"
              onClick={() => handleDeleteAdhocVariable(code)}
            >
              x
            </Button>
          )}
        </Form.Group>
      </Form.Row>
    )
  }


  const InteractionRow = ({ var1 }: { var1?: string }) => {
    const key = var1 || interaction[0]
    const value = (var1 && interactions[var1]) || interaction[1]

    return <Form.Row>
      <Form.Group as={Col} controlId="formInteractionVar1">
        <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
        <Form.Control
          as="select"
          disabled={var1 !== undefined}
          value={key}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const nextCode = (event.target as HTMLInputElement).value;
            setInteraction([nextCode, value]);
          }}
        >
          <option>{variableDefault}</option>
          {variables?.map(v => (
            <option value={v.code}>{v.label}</option>
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
              handleSaveInteraction()
            } else {
              setInteraction([key, var2]);
            }
          }}
        >
          <option>{variableDefault}</option>
          {variables?.map(v => (
            <option value={v.code}>{v.label}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col}>
        {!var1 && (
          <Button
            variant="info"
            onClick={() => handleSaveInteraction()}
          >
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
  };

  const adHocVariablesKeys = Object.keys(adhocVariables);
  const interactionKeys = Object.keys(interactions);

  return (
    <Wrapper>
      <h4>Adhoc variables</h4>
      <Form>
        <h6>Transformations</h6>
        <p>
          Transformation to be applied to a single variable. Examples of
          transformations are mathematical functions (log, exp, center,
          standardize) for numerical variables and coding strategies (dummy,
          poly, Helmert, contrast, ...) for categorical variables.{' '}
        </p>
        {adHocVariablesKeys.length < (variables?.length || 0) && (
          <>
            <p>
              <strong>Add Transformation</strong>
            </p>
            <AdHocRow key={'adhocvariablesrow-edit'} />
          </>
        )}

        {adHocVariablesKeys.map(code => (
          <AdHocRow code={code} key={`adhocvariablesrow-${code}`} />
        ))}

        <h6>Interaction terms</h6>
        <p>Pairwise interactions between variables.</p>
        {interactionKeys.length < Math.floor((variables?.length || 0) / 2) && (
          <>
            <p>
              <strong>Add Interaction</strong>
            </p>
            <InteractionRow key={'interactionrow-edit'} />
          </>
        )}
        {interactionKeys.map(code => (
          <InteractionRow var1={code} key={`interactionrow-${code}`} />
        ))}
        <Form.Row>
          <Form.Group>
            <Button variant="info">
              Save
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </Wrapper>
  );
};

export default AdHocVariable;
