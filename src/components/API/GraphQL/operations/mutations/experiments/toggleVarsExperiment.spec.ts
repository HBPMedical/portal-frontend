import { makeVar } from '@apollo/client';
import { initialExperiment } from '../../../cache';
import { Experiment } from '../../../types.generated';
import createToggleVarsExperiment, { VarType } from './toggleVarsExperiment';

const mockExperimentVar = makeVar<Experiment>(initialExperiment);
const toggleVarsExperiment = createToggleVarsExperiment(mockExperimentVar);

describe('Toggle variable on experiment', () => {
  [
    ['variables', VarType.VARIABLES],
    ['coVariables', VarType.COVARIATES],
    ['filterVariables', VarType.FILTER],
  ].forEach(([tab1, tab2]) => {
    const propName = tab1 as keyof Experiment;
    const type = tab2 as VarType;
    const varsPack1 = ['varTest1', 'varTest2'];
    const varsPack2 = ['varTest1'];
    const varsPack3 = ['varTest2', 'varTest3'];

    it(`Test adding ${propName}`, () => {
      toggleVarsExperiment(varsPack1, type);

      const exp: Experiment = mockExperimentVar();

      expect(exp[propName]).toEqual(varsPack1);
    });

    it(`Test removing ${propName}`, () => {
      toggleVarsExperiment(varsPack2, type);

      const exp: Experiment = mockExperimentVar();

      expect(exp[propName]).toEqual(
        varsPack1.filter((v) => !varsPack2.includes(v))
      );
    });

    it(`Test adding and removing ${propName}`, () => {
      toggleVarsExperiment(varsPack3, type);

      const exp: Experiment = mockExperimentVar();

      expect(exp[propName]).toEqual(['varTest3']);
    });
  });
});
