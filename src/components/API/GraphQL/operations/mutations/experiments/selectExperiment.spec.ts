import { makeVar } from '@apollo/client';
import {
  initMockDomainVar,
  mockDomain
} from '../../../../../../tests/mocks/mockDomainVar';
import { mockExperiment } from '../../../../../../tests/mocks/mockExperiment';
import { initialExperiment } from '../../../cache';
import { Experiment } from '../../../types.generated';
import createSelectExperiment from './selectExperiment';

const mockSelectedExperimentVar = makeVar<Experiment | undefined>(undefined);
const mockDraftExperimentVar = makeVar<Experiment>(initialExperiment);
const mockDomainVar = initMockDomainVar();
const mockSelectDomain = jest.fn();
const selectExperiment = createSelectExperiment(
  mockSelectedExperimentVar,
  mockDraftExperimentVar,
  mockDomainVar,
  mockSelectDomain
);

describe('Select experiment', () => {
  beforeEach(() => {
    mockSelectedExperimentVar(undefined);
    mockDraftExperimentVar(initialExperiment);
    mockDomainVar(mockDomain);
    mockSelectDomain.mockReset();
  });

  it('Selecting an experiment, no domain change', () => {
    selectExperiment(mockExperiment);
    const mockDraftExp = mockDraftExperimentVar();
    const {
      results,
      name,
      viewed,
      shared,
      createdAt,
      finishedAt,
      status,
      id,
      ...subMockDraftExp
    } = mockDraftExp;

    expect(mockSelectDomain.mock.calls.length).toBe(0);

    expect(mockExperiment).toMatchObject(subMockDraftExp);
  });

  it('Selecting an experiment, with domain change', () => {
    mockExperiment.domain = 'test';
    selectExperiment(mockExperiment);
    // with domain change
    expect(mockSelectDomain.mock.calls.length).toBe(1);
  });
});
