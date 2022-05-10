/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import React from 'react';
import { NominalParameter } from '../../API/GraphQL/types.generated';
import NominalInput from './NominalInput';

const nominalParameter: NominalParameter = {
  __typename: 'NominalParameter',
  name: 'id1',
  label: 'Variable 1',
  hint: 'My super hint',
  isRequired: false,
  hasMultiple: false,
  defaultValue: 'val1',
  allowedValues: [
    { label: 'Value 1', value: 'val1' },
    { label: 'Value 2', value: 'val2' }
  ]
};

const renderComponent = () => {
  return render(
    <NominalInput parameter={nominalParameter} handleValueChanged={() => {}} />
  );
};

describe('NominalComponent component', () => {
  describe("when it's a string parameter (base case)", () => {
    it('should have default value', () => {
      const { getByRole } = renderComponent();
      expect(
        getByRole('option', {
          selected: true
        })
      ).toBeDefined();
    });

    it('should have an hint', () => {
      const { getByText } = renderComponent();
      expect(
        nominalParameter.hint && getByText(nominalParameter.hint)
      ).toBeTruthy();
    });

    it('should have a label', () => {
      const { getByText } = renderComponent();
      expect(
        nominalParameter.hint && getByText(nominalParameter.hint)
      ).toBeTruthy();
    });
  });
});
