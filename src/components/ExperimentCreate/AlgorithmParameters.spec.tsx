/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { initialExperiment } from '../API/GraphQL/cache';
import { Experiment } from '../API/GraphQL/types.generated';
import AlgorithmParameters from './AlgorithmParameters';

const exp: Experiment = initialExperiment;

const stringInput = {
  __typename: 'StringParameter',
  name: 'id1',
  label: 'Variable 1',
  hint: 'test',
  isRequired: false,
  hasMultiple: false,
  defaultValue: 'test'
};

const numberInput = {
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

const algo = {
  id: 'dummy-id',
  label: 'Dummy algo',
  description: 'test',
  hasFormula: false,
  variable: {
    hint: 'test',
    isRequired: true,
    allowedTypes: ['nominal'],
    hasMultiple: false
  },
  coVariable: {
    hint: 'test',
    isRequired: true,
    //allowedTypes: [], // accept all types
    hasMultiple: false
  },
  parameters: [stringInput, numberInput]
};

const algoNoParam = {
  id: 'dummy-id',
  label: 'Dummy algo',
  description: 'test',
  hasFormula: false,
  variable: {
    hint: 'test',
    isRequired: true,
    allowedTypes: ['nominal'],
    hasMultiple: false
  },
  coVariable: {
    hint: 'test',
    isRequired: true,
    //allowedTypes: [], // accept all types
    hasMultiple: false
  },
  parameters: []
};

describe('Algorithm parameters component', () => {
  describe('With selected algorithm', () => {
    describe('when there are parameters', () => {
      render(
        <AlgorithmParameters
          experiment={exp}
          handleParameterChange={() => {}}
          algorithm={algo}
        />
      );

      it('it should display two parameters', () => {
        expect(screen.getByText(numberInput.label)).toBeDefined();
        expect(screen.getByText(stringInput.label)).toBeDefined();
      });
    });

    describe('when there no parameters', () => {
      it('should display no parameter needed', () => {
        render(
          <AlgorithmParameters
            experiment={exp}
            handleParameterChange={() => {}}
            algorithm={algoNoParam}
          />
        );
        expect(screen.getByText('No parameters needed')).toBeDefined();
      });
    });
  });

  describe('Without algorithm selected', () => {
    it('should tell user to select an algorithm', async () => {
      render(
        <AlgorithmParameters
          experiment={exp}
          handleParameterChange={() => {}}
        />
      );
      expect(
        screen.getByText(new RegExp('Please, select the algorithm', 'i'))
      ).toBeDefined();
    });
  });
});
