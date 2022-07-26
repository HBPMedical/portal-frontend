import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { initialExperiment } from '../API/GraphQL/cache';
import { QUERY_LIST_ALGORITHMS } from '../API/GraphQL/queries';
import { namedOperations } from '../API/GraphQL/queries.generated';
import {
  Algorithm,
  Experiment,
  Variable
} from '../API/GraphQL/types.generated';
import AvailableAlgorithms from './AvailableAlgorithms';

const exp: Experiment = {
  ...initialExperiment,
  variables: ['var1']
};

const algo: Algorithm = {
  id: 'dummy-id',
  type: 'dummy-type',
  label: 'Dummy algo',
  description: 'test',
  __typename: 'Algorithm',
  hasFormula: false,
  variable: {
    __typename: 'VariableParameter',
    hint: 'test',
    isRequired: true,
    allowedTypes: ['real'],
    hasMultiple: false
  },
  coVariable: {
    __typename: 'VariableParameter',
    hint: 'test',
    isRequired: true,
    allowedTypes: [], // accept no types
    hasMultiple: false
  },
  parameters: []
};

const algoOneVar: Algorithm = {
  id: 'dummy-id2',
  type: 'dummy-type',
  label: 'Dummy algo2',
  description: 'test2',
  __typename: 'Algorithm',
  hasFormula: false,
  variable: {
    __typename: 'VariableParameter',
    hint: 'test',
    isRequired: false,
    allowedTypes: ['integer'],
    hasMultiple: false
  },
  coVariable: null,
  parameters: []
};

const listVars: Variable[] = [
  { id: 'var1', label: 'Variable 1', type: 'integer' }
];

const pipe = (algorithms = [algo]) => ({
  request: {
    operationName: namedOperations.Query.listAlgorithms,
    query: QUERY_LIST_ALGORITHMS
  },
  result: {
    data: {
      algorithms
    }
  }
});

const mocks = [pipe([]), pipe([])];

const renderComponent = (
  exp: Experiment,
  vars: Variable[],
  data = mocks,
  selectedAlgorithm?: Algorithm
) => {
  return render(
    <MockedProvider mocks={data} addTypename={true}>
      <AvailableAlgorithms
        experiment={exp}
        listVariables={vars}
        selectedAlgorithm={selectedAlgorithm}
      />
    </MockedProvider>
  );
};

describe('Available Algorithms component', () => {
  describe('when there is no algorithm', () => {
    it('should display nothing', async () => {
      const { asFragment, getByText } = renderComponent(exp, []);

      expect(getByText('loading...')).not.toBeNull();

      await waitFor(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there are algorithms', () => {
    it('should display one algorithm enabled', async () => {
      const { asFragment } = renderComponent(exp, listVars, [
        pipe([algo, algoOneVar])
      ]);

      await waitFor(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should display one algorithm selected', async () => {
      const { asFragment } = renderComponent(
        exp,
        listVars,
        [pipe([algo, algoOneVar])],
        algoOneVar
      );

      await waitFor(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
