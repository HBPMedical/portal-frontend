import { draftExperimentVar, selectedExperimentVar } from '../../cache';
import createSelectExperiment from './Experiments/selectExperiment';

export const experimentUtils = {
  selectExperiment: createSelectExperiment(
    selectedExperimentVar,
    draftExperimentVar
  )
};
