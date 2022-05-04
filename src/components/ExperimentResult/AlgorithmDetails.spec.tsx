import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { QUERY_LIST_ALGORITHMS } from '../API/GraphQL/queries';
import { namedOperations } from '../API/GraphQL/queries.generated';
import AlgorithmDetails from './AlgorithmDetails';

const algo = {
  id: 'dummy-id',
  label: 'Dummy algo',
  description: 'test',
  __typename: 'Algorithm',
  variable: {
    __typename: 'VariableParameter',
    hint: 'test',
    isRequired: true,
    allowedTypes: [],
    hasMultiple: false
  },
  coVariable: {
    __typename: 'VariableParameter',
    hint: 'test',
    isRequired: true,
    allowedTypes: [],
    hasMultiple: false
  },
  parameters: [
    {
      __typename: 'StringParameter',
      id: 'id1',
      label: 'Variable 1',
      hint: 'test',
      isRequired: false,
      hasMultiple: false,
      defaultValue: 'test'
    },
    {
      __typename: 'StringParameter',
      id: 'id2',
      label: 'Variable 2',
      hint: 'test',
      isRequired: false,
      hasMultiple: false,
      defaultValue: 'test'
    }
  ]
};

const mocks = [
  {
    request: {
      operationName: namedOperations.Query.listAlgorithms,
      query: QUERY_LIST_ALGORITHMS
    },
    result: {
      data: {
        algorithms: [algo]
      }
    }
  }
];

const result = {
  id: algo.id,
  parameters: [
    {
      id: 'id1',
      value: 'val1'
    },
    {
      id: 'id2',
      value: 'val2'
    }
  ]
};

const resultUnknownAlgo = {
  id: 'unknown-id',
  parameters: [
    {
      id: 'id1',
      value: 'val1'
    },
    {
      id: 'id2',
      value: 'val2'
    }
  ]
};

describe("Experiment's algorithm display details", () => {
  describe('when data is correct', () => {
    it('should display loader', async () => {
      const { queryByText } = render(
        <MockedProvider mocks={mocks} addTypename={true}>
          <AlgorithmDetails result={result} />
        </MockedProvider>
      );

      expect(queryByText('loading...')).not.toBeNull();
    });

    it('should display algorithm name and two params', async () => {
      const { queryByText } = render(
        <MockedProvider mocks={mocks} addTypename={true}>
          <AlgorithmDetails result={result} />
        </MockedProvider>
      );

      await waitFor(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(queryByText(new RegExp(algo.label, 'i'))).not.toBeNull();

      expect(
        queryByText(new RegExp(algo.parameters[0].label, 'i'))
      ).not.toBeNull();

      expect(
        queryByText(new RegExp(result.parameters[0].value, 'i'))
      ).not.toBeNull();
    });
  });

  describe('when result is missing', () => {
    it('should not display algorithm', async () => {
      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={true}>
          <AlgorithmDetails result={undefined} />
        </MockedProvider>
      );

      await waitFor(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('when result has unknown id algo', () => {
    it('should display id algo and params', async () => {
      const { queryByText } = render(
        <MockedProvider mocks={mocks} addTypename={true}>
          <AlgorithmDetails result={resultUnknownAlgo} />
        </MockedProvider>
      );

      await waitFor(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(queryByText(new RegExp(resultUnknownAlgo.id, 'i'))).not.toBeNull();

      expect(
        queryByText(new RegExp(resultUnknownAlgo.parameters[0].id, 'i'))
      ).not.toBeNull();

      expect(
        queryByText(new RegExp(resultUnknownAlgo.parameters[0].id, 'i'))
      ).not.toBeNull();
    });
  });
});
