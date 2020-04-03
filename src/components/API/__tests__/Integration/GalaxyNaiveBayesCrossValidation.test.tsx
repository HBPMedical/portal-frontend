import { mount } from 'enzyme';
import * as React from 'react';

import Result from '../../../Result/Result';
import { AlgorithmParameter } from '../../Core';
import { ModelResponse } from '../../Model';

import {
  buildPayload,
  createExperiment,
  createModel,
  TEST_PATHOLOGIES,
  waitForResult
} from '../Utils';

// config

const modelSlug = `naivebayes-${Math.round(Math.random() * 10000)}`;
const algorithmId = 'f2db41e1fa331b3e';
const algorithmLabel = 'Naive Bayes with Cross Validation';
const parameters = [
  { name: 'kfold', label: 'kfold', value: 3 },
  { name: 'alpha', label: 'alpha', value: 0.1 }
];

const model: ModelResponse = {
  query: {
    pathology: TEST_PATHOLOGIES.dementia.code,
    coVariables: [
      { code: 'leftacgganteriorcingulategyrus' },
      { code: 'lefthippocampus' }
    ],
    filters: '',
    groupings: [],
    testingDatasets: [],
    trainingDatasets: TEST_PATHOLOGIES.dementia.datasets.filter(
      d => d.code !== 'fake_longitudinal'
    ),

    validationDatasets: [],
    variables: [
      {
        code: 'alzheimerbroadcategory'
      }
    ]
  }
};

// Test

describe('Integration Test for experiment API', () => {
  
  beforeAll(async () => {
    const mstate = await createModel({
      model,
      modelSlug
    });

    expect(mstate.error).toBeFalsy();
    expect(mstate.model).toBeTruthy();

    return;
  });

  it(`create ${algorithmId}`, async () => {
    const payload = await buildPayload(
      model,
      parameters as AlgorithmParameter[],
      algorithmId,
      algorithmLabel,
      modelSlug
    );

    const { error, experiment } = await createExperiment({
      experiment: payload
    });

    expect(error).toBeFalsy();
    expect(experiment).toBeTruthy();

    const uuid = experiment && experiment.uuid;
    expect(uuid).toBeTruthy();
    if (!uuid) {
      throw new Error('uuid not defined');
    }

    const experimentState = await waitForResult({ uuid });
    expect(experimentState.error).toBeFalsy();
    expect(experimentState.experiment).toBeTruthy();

    const props = { experimentState };
    const wrapper = mount(<Result {...props} />);
    expect(wrapper.find('.error')).toHaveLength(0);
    expect(wrapper.find('.loading')).toHaveLength(0);
    expect(wrapper.find('.result')).toHaveLength(3);
  });
});