import {
  configurationVar,
  domainsVar,
  draftExperimentVar,
  groupsVar,
  selectedDomainVar,
  selectedExperimentVar,
  selectedVariableVar,
  sessionStateVar,
  variablesVar,
  zoomNodeVar
} from '../../cache';
import createResetStore from './common/resetStore';
import createSelectDomain from './common/selectDomain';
import createSetConfiguration from './common/setConfiguration';
import createSetDomains from './common/setDomains';
import createSetZoomToNode from './common/setZoomToNode';
import createResetSelectedExperiment from './experiments/resetSelectedExperiment';
import createSelectExperiment from './experiments/selectExperiment';
import createToggleDatasetExperiment from './experiments/toggleDatasetExperiment';
import createToggleVarsExperiment from './experiments/toggleVarsExperiment';
import createUpdateExperiment from './experiments/updateExperiment';
import createSetSessionState from './user/setSessionState';

const selectDomain = createSelectDomain(
  selectedDomainVar,
  domainsVar,
  draftExperimentVar,
  variablesVar,
  groupsVar
);

export const localMutations = {
  setDomains: createSetDomains(domainsVar),
  selectDomain,
  toggleDatasetExperiment: createToggleDatasetExperiment(
    draftExperimentVar,
    selectedDomainVar,
    variablesVar,
    groupsVar
  ),
  updateDraftExperiment: createUpdateExperiment(draftExperimentVar),
  toggleVarsDraftExperiment: createToggleVarsExperiment(draftExperimentVar),
  setZoomToNode: createSetZoomToNode(zoomNodeVar),
  selectExperiment: createSelectExperiment(
    selectedExperimentVar,
    draftExperimentVar,
    selectedDomainVar,
    selectDomain
  ),
  setConfiguration: createSetConfiguration(configurationVar),
  resetSelectedExperiment: createResetSelectedExperiment(
    selectedExperimentVar,
    draftExperimentVar,
    selectedDomainVar
  ),
  resetStore: createResetStore(
    zoomNodeVar,
    domainsVar,
    selectedDomainVar,
    selectedVariableVar,
    selectedExperimentVar,
    draftExperimentVar,
    variablesVar,
    groupsVar
  ),
  user: {
    setState: createSetSessionState(sessionStateVar)
  }
};
