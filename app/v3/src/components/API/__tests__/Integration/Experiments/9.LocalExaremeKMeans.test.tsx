import { mount } from 'enzyme';
import * as React from 'react';

import Result from '../../../../Result/Result';
import {
  createExperiment,
  createModel,
  uid,
  waitForResult
} from '../../../../utils/TestUtils';
import { VariableEntity } from '../../../Core';
import { Engine } from '../../../Experiment';

// config

const modelSlug = `model-${uid()}`;
const experimentCode = 'K_MEANS';
const parameters = [{ code: 'k', value: 4 }];
const datasets = [{ code: 'adni' }, { code: 'edsd' }];
const model: any = (datasets: VariableEntity[]) => ({
  query: {
    coVariables: [{ code: 'subjectageyears' }],
    filters:
      '{"condition":"AND","rules":[{"id":"subjectageyears","field":"subjectageyears","type":"integer","input":"number","operator":"greater","value":50}],"valid":true}',
    groupings: [],
    testingDatasets: [],
    trainingDatasets: datasets.map(d => ({
      code: d.code
    })),
    validationDatasets: [],
    variables: [{ code: 'apoe4' }]
  }
});

const payload: ExperimentPayload = {
  algorithms: [
    {
      code: experimentCode,
      name: experimentCode, // FIXME: name is used to parse response which is bad !!!
      parameters,
      validation: false
    }
  ],
  model: modelSlug,
  name: `${experimentCode}-${modelSlug}`,
  validations: [],
  engine: Engine.Exareme
};

// Test

describe.skip('Integration Test for experiment API', () => {
  beforeAll(async () => {
    const mstate = await createModel({
      model: model(datasets),
      modelSlug
    });
    expect(mstate.error).toBeFalsy();
    expect(mstate.model).toBeTruthy();

    return true;
  });

  it(`create ${experimentCode}`, async () => {
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
    expect(wrapper.find('div#tabs-methods')).toHaveLength(1);
  });
});
