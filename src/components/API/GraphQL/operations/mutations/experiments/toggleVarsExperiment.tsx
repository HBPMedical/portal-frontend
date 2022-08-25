import { ReactiveVar } from '@apollo/client';
import { Experiment } from '../../../types.generated';

export enum VarType {
  VARIABLES = 'variables',
  COVARIATES = 'coVariables',
  FILTER = 'filterVariables'
}

export default function createToggleVarsExperiment(
  experimentVar: ReactiveVar<Experiment>
) {
  return (vars: string[], type: VarType): void => {
    const oldData = experimentVar()[type] ?? [];
    const newExperiment = { ...experimentVar() };

    newExperiment[type] = [
      ...new Set([
        // for uniqueness
        ...vars.filter(v => !oldData.includes(v)),
        ...oldData.filter(v => !vars.includes(v))
      ])
    ];

    if (type === VarType.VARIABLES) {
      newExperiment.coVariables = newExperiment.coVariables?.filter(
        v => !newExperiment.variables.includes(v)
      );
    }

    if (type === VarType.COVARIATES) {
      newExperiment.variables = newExperiment.variables.filter(
        v => !newExperiment.coVariables?.includes(v)
      );
    }

    if ([VarType.VARIABLES, VarType.COVARIATES].includes(type))
      newExperiment.formula = undefined;

    if (type === VarType.FILTER) newExperiment.filter = '';

    experimentVar(newExperiment);
  };
}
