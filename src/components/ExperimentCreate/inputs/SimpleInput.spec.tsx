/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import React from 'react';
import {
  NumberParameter,
  StringParameter
} from '../../API/GraphQL/types.generated';
import SimpleInput from './SimpleInput';

const numberInput: NumberParameter = {
  __typename: 'NumberParameter',
  name: 'id2',
  label: 'Variable 2',
  hint: 'test',
  isRequired: true,
  hasMultiple: false,
  defaultValue: '2',
  min: 1,
  max: 3
};

const stringInput: StringParameter = {
  __typename: 'StringParameter',
  name: 'id1',
  label: 'Variable 1',
  hint: 'My super hint',
  isRequired: false,
  hasMultiple: false,
  defaultValue: 'my value'
};

describe('SimpleInput component', () => {
  describe("when it's a string parameter (base case)", () => {
    let getByText: any, getByPlaceholderText: any;

    beforeEach(() => {
      const utils = render(<SimpleInput parameter={stringInput} />);
      getByText = utils.getByText;
      getByPlaceholderText = utils.getByPlaceholderText;
    });

    it('should have default value', () => {
      expect(
        stringInput.defaultValue &&
          getByPlaceholderText(stringInput.defaultValue)
      ).toBeTruthy();
    });

    it('should have an hint', () => {
      expect(stringInput.hint && getByText(stringInput.hint)).toBeTruthy();
    });

    it('should have a label', () => {
      expect(stringInput.hint && getByText(stringInput.hint)).toBeTruthy();
    });
  });

  describe("when it's number parameter", () => {
    let getByText: any;

    beforeEach(() => {
      const utils = render(<SimpleInput parameter={numberInput} />);
      getByText = utils.getByText;
    });

    it('should have a minimum value', () => {
      expect(
        numberInput.min && getByText(new RegExp('min value', 'i'))
      ).toBeTruthy();
    });

    it('should have a minimum value', () => {
      expect(
        numberInput.min && getByText(new RegExp('max value', 'i'))
      ).toBeTruthy();
    });
  });
});
