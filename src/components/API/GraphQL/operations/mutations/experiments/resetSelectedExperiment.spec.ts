import { makeVar } from '@apollo/client';
import {
  initMockDomainVar,
  mockDomain
} from '../../../../../../tests/mocks/mockDomainVar';
import { mockExperiment } from '../../../../../../tests/mocks/mockExperiment';
import { initialExperiment } from '../../../cache';
import { Experiment } from '../../../types.generated';
import createResetSelectedExperiment from './resetSelectedExperiment';

const mockDraftExperimentVar = makeVar<Experiment>(mockExperiment);
const mockSelectedExperimentVar = makeVar<Experiment | undefined>(
  mockExperiment
);
const mockDomainVar = initMockDomainVar();
const resetSelectedExperiment = createResetSelectedExperiment(
  mockSelectedExperimentVar,
  mockDraftExperimentVar,
  mockDomainVar
);

describe('ResetSelectedExperiment', () => {
  beforeEach(() => {
    mockDraftExperimentVar(mockExperiment);
    mockSelectedExperimentVar(mockExperiment);
    mockDomainVar(mockDomain);
  });
  it('Test reset selected experiment', () => {
    resetSelectedExperiment();
    const domain = mockDomainVar()?.id ?? '';
    const datasets =
      mockDomainVar()
        ?.datasets.filter(d => !d.isLongitudinal)
        .map(d => d.id) ?? [];
    expect(mockSelectedExperimentVar()).toBe(undefined);
    expect(mockDraftExperimentVar()).toStrictEqual({
      ...initialExperiment,
      domain,
      datasets
    });
  });

  it('Test reset selected experiment without domain', () => {
    mockDomainVar(undefined);
    resetSelectedExperiment();

    expect(mockDraftExperimentVar()).toStrictEqual(initialExperiment);
    expect(mockSelectedExperimentVar()).toBe(undefined);
  });
});
