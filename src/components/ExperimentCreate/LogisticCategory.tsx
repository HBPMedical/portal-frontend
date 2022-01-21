import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

import { VariableEntity } from '../API/Core';
import { Experiment, Variable } from '../API/GraphQL/types.generated';

type LocalVar = VariableEntity[] | undefined;

interface Props {
  parameterName: string;
  required?: boolean;
  experiment: Experiment;
  handleChangeCategoryParameter: (id: string, value: string) => void;
  lookup: (id: string) => Variable | undefined;
}

const ControlBox = styled.div`
  padding-top: 16px;
`;

export default ({
  parameterName,
  experiment,
  required = false,
  handleChangeCategoryParameter,
  lookup
}: Props): JSX.Element => {
  const [categories, setCategories] = useState<Variable[]>();
  const lookupCallback = useCallback(lookup, []);
  const handleChangeCategoryParameterCallback = useCallback(
    handleChangeCategoryParameter,
    []
  );

  useEffect(() => {
    const categoricalVariables: string[] | undefined = [
      ...(experiment.variables || [])
    ];
    const vars =
      categoricalVariables &&
      categoricalVariables
        .map(v => lookupCallback(v))
        .filter(v => v && v.type === 'nominal');

    setCategories(vars as Variable[]);

    handleChangeCategoryParameterCallback(parameterName, '');
  }, [
    lookupCallback,
    handleChangeCategoryParameterCallback,
    parameterName,
    experiment.variables
  ]);

  const handleChangeValue = (
    event: React.FormEvent<any>,
    name: string
  ): void => {
    event.preventDefault();
    const value = (event.target as HTMLInputElement).value;

    handleChangeCategoryParameter(parameterName, value);
  };

  return (
    <>
      {!categories && <p>Please, select a categorical variable</p>}
      {categories &&
        categories.map(category => (
          <ControlBox key={category.id}>
            <Form.Label>{category.label}</Form.Label>
            <Form.Control
              as={'select'}
              placeholder="select"
              id={`parameter-category-chooser-${category.id}`}
              required={required}
              onChange={(event): void => {
                handleChangeValue(event, category.id);
              }}
            >
              <option value={'select'}>
                Select a level ({required ? 'mandatory' : 'optional'})
              </option>
              {category &&
                category.enumerations &&
                category.enumerations.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
            </Form.Control>
          </ControlBox>
        ))}
    </>
  );
};
