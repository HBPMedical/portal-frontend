import * as React from 'react';
import { VariableEntity } from '../API/Core';
import { IFormula, ModelResponse } from '../API/Model';
import styled from 'styled-components';

interface Props {
  model?: ModelResponse;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
}

const FormulaStyle = styled.div`
  h6 {
    margin-bottom: 0.2em;
  }

  div {
    margin-bottom: 0.5em;
  }
`;
class Model extends React.Component<Props> {
  render(): JSX.Element {
    const { model, lookup } = this.props;
    const query = model && model.query;

    return (
      <>
        {query && (
          <>
            {query.variables && (
              <section>
                <h4>Variables</h4>
                {query.variables.map((v: any) => (
                  <p key={v.code}>{lookup(v.code, query.pathology).info}</p>
                ))}
              </section>
            )}

            {((query.coVariables && query.coVariables.length > 0) ||
              (query.groupings && query.groupings.length > 0)) && (
              <section>
                <h4>Covariates</h4>
                {query.coVariables &&
                  query.coVariables.length > 0 &&
                  query.coVariables.map((v: any) => (
                    <p key={v.code}>{lookup(v.code, query.pathology).info}</p>
                  ))}
                {query.groupings &&
                  query.groupings.length > 0 &&
                  query.groupings.map((v: any) => (
                    <p key={v.code}>{lookup(v.code, query.pathology).info}</p>
                  ))}
              </section>
            )}

            {query.filters && (
              <section>
                <h4>Filters</h4>
                {this.formatFilter(query.filters)}
              </section>
            )}

            {(query.formula?.interactions ||
              query.formula?.transformations) && (
              <section>
                <h4>Formula</h4>
                {this.formatFormula(query.formula)}
              </section>
            )}
          </>
        )}
      </>
    );
  }

  private ruleOperator = (operator: string): string => {
    switch (operator) {
      case 'greater':
        return '>';

      case 'less':
        return '<';

      case 'equal':
        return '=';

      case 'not equal':
        return '!=';

      default:
        return operator;
    }
  };

  private formatFilter = (filter: any): JSX.Element => {
    const { lookup, model } = this.props;
    const humanRules: any = [];
    const pathologyCode = model?.query?.pathology;
    try {
      const json = JSON.parse(filter);

      const stringifyRules = (data: any, level: number): void => {
        data.rules.forEach((rule: any, index: number) => {
          const condition = {
            data: `${data.condition}`,
            level
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
              lookup(rule.field, pathologyCode).label
            } ${this.ruleOperator(rule.operator)} ${rule.value}`,
            level
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

    const Transformation = () => (
      <>
        {(transformations?.length || 0) > 0 && <h6>Transformations</h6>}
        {transformations?.map(t => (
          <p key={t.operation}>
            <em>{t.operation}: </em>
            {t.name}
          </p>
        )) || <></>}
      </>
    );
    const Interaction = () => (
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
