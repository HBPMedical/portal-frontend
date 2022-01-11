import {
  domainsVar,
  draftExperimentVar,
  selectedDomainVar,
  zoomNodeVar
} from '../../cache';
import createSelectDomain from './common/selectDomain';
import createSetDomains from './common/setDomains';
import createSetZoomToNode from './common/setZoomToNode';
import createToggleVarsExperiment from './experiments/toggleVarsExperiment';
import createUpdateExperiment from './experiments/updateExperiment';

export const localMutations = {
  setDomains: createSetDomains(domainsVar),
  selectDomain: createSelectDomain(selectedDomainVar, domainsVar),
  updateDraftExperiment: createUpdateExperiment(draftExperimentVar),
  toggleVarsDraftExperiment: createToggleVarsExperiment(draftExperimentVar),
  setZoomToNode: createSetZoomToNode(zoomNodeVar)
};
