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
  const helper = [parameter.hint];

  if (parameter.__typename === 'StringParameter') {
    options.type = 'text';
  }

  if (parameter.__typename === 'NumberParameter') {
    options.min = parameter.min ?? undefined;
    options.max = parameter.max ?? undefined;
    options.step = parameter.isReal ? 0.01 : 1;
    options.type = 'number';
    if (parameter.min || parameter.max)
      helper.push(
        `${parameter.min ? `min value: ${parameter.min} ` : ''}${
          parameter.max ? `max value: ${parameter.max}` : ''
        }`
      );
  }

  if (parameter.isRequired) helper.push('Required');

  return (
    <Form.Group>
      <Form.Label htmlFor={`${parameter.name}`}>{parameter.label}</Form.Label>
      <Form.Control
        {...options}
        onChange={e => handleValueChanged?.(parameter.name, e.target.value)}
      ></Form.Control>
      {helper.map((text, i) => (
        <Form.Text key={i} className="text-muted">
          {text}
        </Form.Text>
      ))}
    </Form.Group>
  );
};

export default SimpleInput;
