import React from 'react';
import { Form } from 'react-bootstrap';
import { NumberParameter } from '../../API/GraphQL/types.generated';

type Props = {
  parameter: NumberParameter;
};

const NumberInput = ({ parameter }: Props) => {
  const defaultValue = parameter.defaultValue ?? '';
  return (
    <Form.Group key={parameter.id}>
      <Form.Label htmlFor={`${parameter.id}`}>{parameter.label}</Form.Label>
      <Form.Control
        type="Number"
        required={parameter.isRequired ?? false}
        defaultValue={defaultValue}
        placeholder={defaultValue}
      ></Form.Control>
      {parameter.hint ?? <small>{parameter.hint}</small>}
    </Form.Group>
  );
};

export default NumberInput;
