import React from 'react';
import { QUERY_LIST_ALGORITHMS } from '../API/GraphQL/queries';
import { namedOperations } from '../API/GraphQL/queries.generated';

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

describe('Available algorithms display', () => {
  describe('when data is correct', () => {
    it.todo('testing');
  });
});
