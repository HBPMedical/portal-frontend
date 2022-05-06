import React from 'react';
import { Form } from 'react-bootstrap';
import { StringParameter } from '../../API/GraphQL/types.generated';

type Props = {
  parameter: StringParameter;
  handleValueChanged?: (key: string, value: string) => void;
};

const StringInput = ({ parameter, handleValueChanged }: Props) => {
  const defaultValue = parameter.defaultValue ?? '';
  return (
    <Form.Group key={parameter.id}>
      <Form.Label htmlFor={`${parameter.id}`}>{parameter.label}</Form.Label>
      <Form.Control
        required={parameter.isRequired ?? false}
        defaultValue={defaultValue}
        placeholder={defaultValue}
        onChange={e => handleValueChanged?.(parameter.id, e.target.value)}
      ></Form.Control>

      {parameter.hint ?? (
        <Form.Text className="text-muted">{parameter.hint}</Form.Text>
      )}
    </Form.Group>
  );
};

export default StringInput;
