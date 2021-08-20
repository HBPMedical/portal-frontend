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

interface Interactions {
  [key: string]: string; // var1 as key, var2 as value
}

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
  const [adhocVariables, setAdhocVariables] = useState<IAdHocVariables>({});
  const [interactions, setInteractions] = useState<Interactions>({});
  const lookupCallback = useCallback(lookup, []);

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

  useEffect(() => {
    console.log(adhocVariables);
  }, [adhocVariables]);

  const handleChangeAdhocVariable = (code: string): void => {
    setAdhocVariables({
      ...adhocVariables,
      [code]: adhocVariables[code] || ''
    });
  };

  const handleChangeAdhocTransformation = (
    code: string,
    transformation: string
  ): void => {
    setAdhocVariables({ ...adhocVariables, [code]: transformation });
  };

  const handleDeleteAdhocVariable = (code?: string) => {
    if (!code) return;
    const newAdhocs = { ...adhocVariables };
    delete newAdhocs[code];
    setAdhocVariables(newAdhocs);
  };

  const handleAddInteraction = (code: string) => {
    setInteractions({ ...interactions, [code]: interactions[code] || '' });
  };

  const handleAddInteractionVar2 = (var1: string, var2: string) => {
    setInteractions({ ...interactions, [var1]: var2 });
  };

  const handleDeleteInteraction = (var1?: string) => {
    if (!var1) return;
    const newInteractions = { ...interactions };
    delete newInteractions[var1];
    setInteractions(newInteractions);
  };

  const AdHocRow = ({ code }: { code?: string }) => (
    <Form.Row>
      <Form.Group as={Col} controlId="formVariable">
        <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
        <Form.Control
          as="select"
          defaultValue={variableDefault}
          value={code}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const nextCode = (event.target as HTMLInputElement).value;
            if (nextCode !== variableDefault)
              handleChangeAdhocVariable(nextCode);
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
          defaultValue={transformationDefault}
          disabled={!code}
          value={code && adhocVariables[code]}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const t = (event.target as HTMLInputElement).value;
            if (t !== transformationDefault)
              handleChangeAdhocTransformation(code!, t);
          }}
        >
          <option>{transformationDefault}</option>
          {transformations[
            variables?.find(v => v.code === code)?.type === 'nominal'
              ? 'nominal'
              : 'real'
          ]?.map(f => (
            <option value={f}>{f}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col}>
        {code && (
          <Button
            variant="danger"
            onClick={() => handleDeleteAdhocVariable(code)}
          >
            -
          </Button>
        )}
      </Form.Group>
    </Form.Row>
  );

  const InteractionRow = ({ var1 }: { var1?: string }) => (
    <Form.Row>
      <Form.Group as={Col} controlId="formInteractionVar1">
        <Form.Label style={{ display: 'none' }}>Variables</Form.Label>
        <Form.Control
          as="select"
          defaultValue={variableDefault}
          value={var1}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const nextCode = (event.target as HTMLInputElement).value;
            if (nextCode !== variableDefault) handleAddInteraction(nextCode);
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
          defaultValue={variableDefault}
          disabled={!var1}
          value={var1 && interactions[var1]}
          onChange={(event: React.FormEvent<any>): void => {
            event.preventDefault();
            const var2 = (event.target as HTMLInputElement).value;
            if (var2 !== variableDefault) handleAddInteractionVar2(var1!, var2);
          }}
        >
          <option>{variableDefault}</option>
          {variables?.map(v => (
            <option value={v.code}>{v.label}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col}>
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
        {adHocVariablesKeys.map(code => (
          <AdHocRow code={code} key={`adhocvariablesrow-${code}`} />
        ))}

        {adHocVariablesKeys.length < (variables?.length || 0) && (
          <>
            <p>
              <strong>Add Transformation</strong>
            </p>
            <AdHocRow />
          </>
        )}

        <h6>Interaction terms</h6>
        <p>Pairwise interactions between variables.</p>
        {interactionKeys.map(code => (
          <InteractionRow var1={code} key={`interactionrow-${code}`} />
        ))}

        {interactionKeys.length < Math.floor((variables?.length || 0) / 2) && (
          <>
            <p>
              <strong>Add Interaction</strong>
            </p>
            <InteractionRow />
          </>
        )}

        <Form.Row>
          <Form.Group>
            <Button variant="info" type="submit">
              Save
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </Wrapper>
  );
};

export default AdHocVariable;
