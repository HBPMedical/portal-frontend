import {
  domainsVar,
  draftExperimentVar,
  selectedDomainVar,
  selectedExperimentVar,
  zoomNodeVar
} from '../../cache';
import createSelectDomain from './common/selectDomain';
import createSetDomains from './common/setDomains';
import createSetZoomToNode from './common/setZoomToNode';
import createResetSelectedExperiment from './experiments/resetSelectedExperiment';
import createSelectExperiment from './experiments/selectExperiment';
import createToggleDatasetExperiment from './experiments/toggleDatasetExperiment';
import createToggleVarsExperiment from './experiments/toggleVarsExperiment';
import createUpdateExperiment from './experiments/updateExperiment';

export const localMutations = {
  setDomains: createSetDomains(domainsVar),
  selectDomain: createSelectDomain(
    selectedDomainVar,
    domainsVar,
    draftExperimentVar
  ),
  toggleDatasetExperiment: createToggleDatasetExperiment(
    draftExperimentVar,
    selectedDomainVar
  ),
  updateDraftExperiment: createUpdateExperiment(draftExperimentVar),
  toggleVarsDraftExperiment: createToggleVarsExperiment(draftExperimentVar),
  setZoomToNode: createSetZoomToNode(zoomNodeVar),
  selectExperiment: createSelectExperiment(
    selectedExperimentVar,
    draftExperimentVar
  ),
  resetSelectedExperiment: createResetSelectedExperiment(
    selectedExperimentVar,
    draftExperimentVar
  )
};
