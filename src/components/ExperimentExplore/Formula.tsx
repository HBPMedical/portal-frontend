import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { D3Model, HierarchyCircularNode } from '../API/Model';
import { ModelType } from './Container';

interface Props {
  Terms: any;
  filters: any;
  handleChangeFilter: any;
}

interface State {
  loading: boolean;
  TermsChanged: boolean;
}

const Formula = styled.textarea`
  width: 100%;
  height: 64px;
`;

interface Term {
  factor: string;
  operator: string | null;
  // value: string | null;
}

interface Formula {
  leftTerm: Term[];
  rightTerm: Term[];
}

export default ({
  parameters,
  handleUpdateD3Model,
  setFormulaString
}: {
  parameters: D3Model;
  handleUpdateD3Model: (
    model?: ModelType,
    node?: HierarchyCircularNode
  ) => void;
  setFormulaString: (f: string) => void;
}): JSX.Element => {
  const [formula, setFormula] = useState<Formula>({
    leftTerm: [],
    rightTerm: []
  });
  const [editedFormula, setEditedFormula] = useState('');

  useEffect(() => {
    if (parameters) {
      const variables = parameters.variables;
      const covariables = parameters.covariables;

      // addMissing, filter duplicates
      setFormula(prevFormula => {
        const leftTerm = [
          ...((variables &&
            variables.map(v =>
              prevFormula.leftTerm.map(t => t.factor).includes(v.data.id)
                ? prevFormula.leftTerm.find(t => t.factor === v.data.id)!
                : { factor: v.data.id, operator: '+' }
            )) ||
            [])
        ].filter(
          t => variables && variables.map(v => v.data.id).includes(t.factor)
        );

        const rightTerm = [
          ...((covariables &&
            covariables.map(v =>
              prevFormula.rightTerm.map(t => t.factor).includes(v.data.id)
                ? prevFormula.rightTerm.find(t => t.factor === v.data.id)!
                : { factor: v.data.id, operator: '+' }
            )) ||
            [])
        ].filter(
          t => covariables && covariables.map(v => v.data.id).includes(t.factor)
        );

        return {
          leftTerm,
          rightTerm
        };
      });
    }
  }, [parameters, setFormula]);

  // Cast edited text formula to Formula type
  // Update the current model
  const handleValidate = () => {
    if (editedFormula === '') {
      return;
    }

    const variables =
      parameters.variables && parameters.variables.map(c => c.data.id);
    const covariables =
      parameters.covariables && parameters.covariables.map(c => c.data.id);
    const [leftStringTerms, rightStringTerms] = editedFormula.split('~');

    // filter left terms => ['+', 'y1', ...]
    const lterms =
      (leftStringTerms && [
        '+', // first term dummy operator
        ...leftStringTerms
          .split(' ')
          .map(c => c.trim())
          .filter(c => c !== '')
      ]) ||
      [];

    // => [{ operator: '+', factor: 'y1'}, ...]
    const leftTerm: Term[] = lterms
      .reduce(
        (acc: Term[], cur, i) =>
          i % 2 === 0
            ? [
                ...acc,
                {
                  operator: cur,
                  factor: lterms[i + 1]
                }
              ]
            : acc,
        []
      )
      // validate against selected variables
      .filter(c => variables && variables.includes(c.factor));

    const rterms =
      (rightStringTerms && [
        '+', // first term dummy operator
        ...rightStringTerms
          .split(' ')
          .map(c => c.trim())
          .filter(c => c !== '')
      ]) ||
      [];

    const rightTerm: Term[] = rterms
      .reduce(
        (acc: Term[], cur, i) =>
          i % 2 === 0
            ? [
                ...acc,
                {
                  operator: cur,
                  factor: rterms[i + 1]
                }
              ]
            : acc,
        []
      )
      .filter(c => covariables && covariables.includes(c.factor));

    // update model by sending removed values
    const nextSelectedVariables =
      parameters.variables &&
      parameters.variables.filter(
        v => !leftTerm.map(t => t.factor).includes(v.data.id)
      );
    nextSelectedVariables &&
      nextSelectedVariables.forEach(v =>
        handleUpdateD3Model(ModelType.VARIABLE, v)
      );

    const nextSelectedCovariables =
      parameters.covariables &&
      parameters.covariables.filter(
        v => !rightTerm.map(t => t.factor).includes(v.data.id)
      );
    nextSelectedCovariables &&
      nextSelectedCovariables.forEach(v =>
        handleUpdateD3Model(ModelType.COVARIABLE, v)
      );

    setEditedFormula('');
    setFormula({ leftTerm, rightTerm });
  };

  const formulaToString = (): string => {
    if (editedFormula !== '') {
      return editedFormula;
    }

    const leftTerm = formula.leftTerm
      .map((l, i) => (i === 0 ? l.factor : `${l.operator} ${l.factor}`))
      .join(' ');

    const rightTerm = formula.rightTerm
      .map((l, i) => (i === 0 ? l.factor : `${l.operator} ${l.factor}`))
      .join(' ');

    const formulaString = `${leftTerm} ~ ${rightTerm}`;
    setFormulaString(formulaString);
    return formulaString;
  };

  return (
    <>
      <Formula
        id="formula-element"
        value={formulaToString()}
        onChange={(event: React.FormEvent<HTMLTextAreaElement>): void =>
          setEditedFormula(event.currentTarget.value)
        }
        onBlur={handleValidate}
      />
    </>
  );
};
