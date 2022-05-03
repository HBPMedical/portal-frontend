import { makeVar } from '@apollo/client';
import { initialExperiment } from '../../../cache';
import { Experiment } from '../../../types.generated';
import createUpdateExperiment from './updateExperiment';

const mockExperimentVar = makeVar<Experiment>(initialExperiment);

const updateExperiment = createUpdateExperiment(mockExperimentVar);

describe('Test name', () => {
  beforeEach(() => mockExperimentVar(initialExperiment));

  it('Set experiment data', () => {
    const data: Partial<Experiment> = {
      name: 'Test',
      variables: ['test', 'test2']
    };
    updateExperiment(data);

    const experiment = { ...mockExperimentVar(), ...data };

    expect(mockExperimentVar()).toStrictEqual(experiment);
  });
});
