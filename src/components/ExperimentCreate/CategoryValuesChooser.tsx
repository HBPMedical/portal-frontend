import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Experiment, Variable } from '../API/GraphQL/types.generated';

interface JsonParam {
  [name: string]: string | undefined;
}

interface Props {
  parameterName: string;
  experiment: Experiment;
  required?: boolean;
  handleChangeCategoryParameter: (code: string, value: string) => void;
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
  const [categories, setCategories] = useState<Variable[]>([]);
  const [referenceValues, setReferencesValues] = useState<JsonParam>();
  const handleChangeCategoryParameterCallback = useCallback(
    handleChangeCategoryParameter,
    []
  );

  useEffect(() => {
    const categoricalVariables: string[] | undefined = [
      ...(experiment.coVariables || [])
    ];
    const vars =
      (categoricalVariables &&
        categoricalVariables
          .map(v => lookup(v))
          .filter(v => v && v.type === 'nominal')) ??
      [];

    setCategories(vars as Variable[]);

    handleChangeCategoryParameterCallback(parameterName, JSON.stringify([]));
  }, [
    handleChangeCategoryParameterCallback,
    parameterName,
    experiment.coVariables,
    lookup
  ]);

  const handleChangeValue = (
    event: React.FormEvent<any>,
    name: string
  ): void => {
    event.preventDefault();

    const value = (event.target as HTMLInputElement).value;
    const params: JsonParam = {
      ...referenceValues,
      [name]: value !== 'select' ? value : undefined
    };
    setReferencesValues(params);

    const validKeys =
      params &&
      Object.keys(params).filter(k => {
        return params[k] !== undefined;
      });
    const jsonString = validKeys.map(k => ({ name: k, val: params[k] }));
    handleChangeCategoryParameter(parameterName, JSON.stringify(jsonString));
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
              /*               componentClass="select"
               */ placeholder="select"
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
