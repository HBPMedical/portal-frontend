import { draftExperimentVar, selectedExperimentVar } from '../../cache';
import createGetExperiment from './Experiments/getExperiment';

export const experimentQueries = {
  getExperiment: createGetExperiment(selectedExperimentVar, draftExperimentVar)
};
