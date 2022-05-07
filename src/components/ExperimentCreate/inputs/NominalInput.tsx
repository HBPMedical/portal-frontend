import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import {
  AllowedLink,
  Experiment,
  NominalParameter,
  OptionValue,
  Variable
} from '../../API/GraphQL/types.generated';

type Props = {
  parameter: NominalParameter;
  handleValueChanged: (key: string, value: string) => void;
  experiment?: Experiment;
  variables?: Variable[];
};

const getLinkedVar = (
  parameter: NominalParameter,
  exp?: Experiment,
  vars?: Variable[]
): Variable | undefined => {
  if (!exp || !vars || !parameter.linkedTo) return undefined;

  const idCandidates =
    (parameter.linkedTo === AllowedLink.Variable
      ? exp.variables
      : exp.coVariables) ?? [];

  const variable = vars.find(
    v => idCandidates.includes(v.id) && v.type === 'nominal'
  );

  if (variable && variable.enumerations) {
    return variable;
  }

  return undefined;
};

const NominalInput = ({
  parameter,
  experiment,
  variables,
  handleValueChanged
}: Props) => {
  const isLinked = parameter.linkedTo;
  const linkedVar = getLinkedVar(parameter, experiment, variables);
  const options: OptionValue[] =
    (isLinked
      ? linkedVar?.enumerations?.map(e => ({
          id: e.id,
          label: e.label ?? e.id
        }))
      : parameter.allowedValues) ?? [];
  const title = `${parameter.label ?? parameter.id} ${
    isLinked ? `(${linkedVar?.label})` : ''
  }`;
  const helper = [parameter.hint];

  if (parameter.isRequired) helper.push('Required');

  if (options.length === 0) return <></>;

  return (
    <Form.Group controlId="exampleForm.SelectCustom">
      <Form.Label>{title}</Form.Label>
      <Form.Control
        as="select"
        custom
        onChange={e => handleValueChanged?.(parameter.id, e.target.value)}
        defaultValue={parameter.defaultValue ?? undefined}
      >
        {!parameter.isRequired && <option>Select an option</option>}
        {options.map(opt => {
          return (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          );
        })}
      </Form.Control>
      {helper.map((text, i) => (
        <Form.Text key={i} className="text-muted">
          {text}
        </Form.Text>
      ))}
    </Form.Group>
  );
};

export default NominalInput;
