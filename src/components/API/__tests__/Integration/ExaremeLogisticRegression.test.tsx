import { mount } from 'enzyme';
import * as React from 'react';

import Result from '../../../ExperimentResult/Result';
import {
  ExperimentParameter,
  IExperiment,
  IExperimentPrototype
} from '../../Experiment';
import {
  createExperiment,
  TEST_PATHOLOGIES,
  waitForResult
} from '../../UtiltyTests';

// config

const modelSlug = `logistic-${Math.round(Math.random() * 10000)}`;
const algorithmId = 'LOGISTIC_REGRESSION';
const algorithmLabel = 'Logistic Regression';
const parameters: ExperimentParameter[] = [
  {
    name: 'x', // covariable
    value: 'lefthippocampus,rightacgganteriorcingulategyrus'
  },
  {
    name: 'y', // variable
    value: 'gender'
  },
  { name: 'positive_level', label: 'other', value: 'M' },
  { name: 'negative_level', label: 'other', value: 'F' },
  {
    name: 'pathology',
    value: TEST_PATHOLOGIES.dementia.code
  },
  {
    name: 'dataset',
    value: TEST_PATHOLOGIES.dementia.datasets
      .filter(d => d.code !== 'fake_longitudinal')
      .map(d => d.code)
      .toString()
  },
  {
    name: 'filter',
    value: ''
  },
  {
    name: 'formula',
    value: "{\"single\":[{\"var_name\":\"lefthippocampus\",\"unary_operation\":\"standardize\"},{\"var_name\":\"rightacgganteriorcingulategyrus\",\"unary_operation\":\"center\"}],\"interactions\":[{\"var1\":\"lefthippocampus\",\"var2\":\"rightacgganteriorcingulategyrus\"}]}"
  }
];

const experiment: IExperimentPrototype = {
  algorithm: {
    name: algorithmId,
    parameters,
    type: 'string'
  },
  name: modelSlug
};

// Test

describe('Integration Test for experiment API', () => {
  it(`create ${algorithmId}`, async () => {
    const { experiment: result } = await createExperiment({
      experiment
    });

    expect(result).toBeTruthy();
    expect(result.status).toStrictEqual('pending');

    const uuid = (result as IExperiment)?.uuid;
    expect(uuid).toBeTruthy();

    if (!uuid) {
      throw new Error('uuid not defined');
    }

    const experimentState = await waitForResult({ uuid });

    expect(experimentState.experiment.status).toStrictEqual('success');
    expect(experimentState.experiment).toBeTruthy();

    const props = { experimentState };

    let wrapper: any = mount(<Result {...props} />);
    expect(wrapper.find('.error')).toHaveLength(0);
    expect(wrapper.find('.loading')).toHaveLength(0);
    expect(wrapper.find('.result')).toHaveLength(4);
    expect(
      wrapper
        .find('div.result table tbody tr td')
        .at(1)
        .text()
    ).toEqual('9.685');
  });
});
