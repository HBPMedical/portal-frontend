/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react';
import styled from 'styled-components';
import { Domain, Experiment, Variable } from '../API/GraphQL/types.generated';
import { IFormula } from '../utils';

const FormulaStyle = styled.div`
  h6 {
    margin-bottom: 0.2em;
  }

  div {
    margin-bottom: 0.5em;
  }
`;

interface Props {
  experiment: Experiment;
  domain: Domain;
}

class Model extends Component<Props> {
  render(): JSX.Element {
    const { experiment, domain } = this.props;

    return (
      <>
        {experiment && (
          <>
            {experiment.variables && (
              <section>
                <h3>Variables</h3>
                <ul>
                  {domain.variables
                    .filter((v) => experiment.variables.includes(v.id))
                    .map((v) => (
                      <li key={v.id}>{this.infoVariable(v)} </li>
                    ))}
                </ul>
              </section>
            )}

            {experiment.coVariables && experiment.coVariables.length > 0 && (
              <section>
                <h3>Covariates</h3>
                <ul>
                  {this.lookup(experiment.coVariables, domain).map((v) => (
                    <li key={v.id}>{this.infoVariable(v)}</li>
                  ))}
                </ul>
              </section>
            )}

            {experiment.filter && (
              <section>
                <h3>Filters</h3>
                {this.formatFilter(experiment.filter)}
              </section>
            )}

            {experiment.formula &&
              ((experiment.formula.interactions ?? []).length > 0 ||
                (experiment.formula.transformations ?? []).length > 0) && (
                <section>
                  <h3>Formula</h3>
                  {this.formatFormula(experiment.formula)}
                </section>
              )}
          </>
        )}
      </>
    );
  }

  private infoVariable = (v: Variable): string =>
    `${v.label ?? v.id} ${v.type ? `(${v.type})` : ''}`;

  private lookup = (idVars: string[], domain: Domain): Variable[] =>
    domain.variables.filter((v) => idVars.includes(v.id));

  private ruleOperator = (operator: string): string => {
    switch (operator) {
      case 'greater':
        return '>';

      case 'less':
        return '<';

      case 'equal':
        return '=';

      case 'not_equal':
        return '!=';

      default:
        return operator;
    }
  };

  private formatFilter = (filter: any): JSX.Element => {
    const { domain } = this.props;
    const humanRules: any = [];

    try {
      const json = JSON.parse(filter);

      const stringifyRules = (data: any, level: number): void => {
        data.rules.forEach((rule: any, index: number) => {
          const condition = {
            data: `${data.condition}`,
            level,
          };

          if (rule.condition) {
            stringifyRules(rule, level + 1);

            if (index < data.rules.length - 1) {
              humanRules.push(condition);
            }

            return;
          }

          humanRules.push({
            data: `${
              this.lookup([rule.field], domain).pop()?.label
            } ${this.ruleOperator(rule.operator)} ${rule.value}`,
            level,
          });

          if (index < data.rules.length - 1) {
            humanRules.push(condition);
          }
        });
      };
      stringifyRules(json, 0);
    } catch (e) {
      console.log(e);
    }

    return humanRules.map((box: any, index: number) => {
      return (
        <p key={index} className={`level-${box.level}`}>
          {box.data}
        </p>
      );
    });
  };

  private formatFormula = (formula: IFormula): JSX.Element => {
    const transformations = formula.transformations;
    const interactions = formula.interactions;

    const Transformation = (): JSX.Element => (
      <>
        {(transformations?.length || 0) > 0 && <h6>Transformations</h6>}
        {transformations?.map((t) => (
          <p key={t.operation}>
            <em>{t.operation}: </em>
            {t.id}
          </p>
        )) || <></>}
      </>
    );
    const Interaction = (): JSX.Element => (
      <>
        {(interactions?.length || 0) > 0 && <h6>Interactions</h6>}
        {interactions?.map((i, j) => (
          <p key={`${j}`}>{i.join('-')}</p>
        ))}
      </>
    );

    return (
      <FormulaStyle>
        <div>
          <Transformation />
        </div>
        <div>
          <Interaction />
        </div>
      </FormulaStyle>
    );
  };
}

export default Model;
