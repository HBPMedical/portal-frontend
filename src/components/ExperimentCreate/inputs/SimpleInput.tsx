import React from 'react';
import { Form } from 'react-bootstrap';
import {
  NumberParameter,
  StringParameter
} from '../../API/GraphQL/types.generated';

interface Dictionary<T> {
  [Key: string]: T;
}

type Props = {
  parameter: NumberParameter | StringParameter;
  handleValueChanged?: (key: string, value: string) => void;
};

const SimpleInput = ({ parameter, handleValueChanged }: Props) => {
  const defaultValue = parameter.defaultValue ?? undefined;
  const options: Dictionary<string | number | boolean | undefined> = {
    required: parameter.isRequired ?? false,
    defaultValue,
    placeholder: defaultValue
  };
  const helpLine = [];
  const helper = [parameter.hint];

  if (parameter.isRequired) helpLine.push('Required');

  if (parameter.__typename === 'StringParameter') {
    options.type = 'text';
  }

  if (parameter.__typename === 'NumberParameter') {
    options.min = parameter.min ?? undefined;
    options.max = parameter.max ?? undefined;
    options.step = parameter.isReal ? 0.01 : 1;
    options.type = 'number';
    if (parameter.min) helpLine.push(`min value: ${parameter.min}`);
    if (parameter.max) helpLine.push(`max value: ${parameter.max}`);
  }

  if (helpLine.length > 0) helper.push(helpLine.join(', '));

  return (
    <Form.Group>
      <Form.Label htmlFor={`${parameter.name}`}>{parameter.label}</Form.Label>
      <Form.Control
        {...options}
        onChange={e => handleValueChanged?.(parameter.name, e.target.value)}
      ></Form.Control>
      {helper
        .filter(t => t && t?.length > 1)
        .map(t => t as string)
        .map((text, i) => (
          <Form.Text key={i} className="text-muted">
            {text?.charAt(0).toUpperCase() + text?.slice(1)}
          </Form.Text>
        ))}
    </Form.Group>
  );
};

export default SimpleInput;
