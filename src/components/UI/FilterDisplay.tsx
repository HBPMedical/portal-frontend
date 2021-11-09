import React from 'react';
import { VariableEntity } from '../API/Core';

interface Props {
  filter?: string;
  lookup: (id: string) => VariableEntity;
}

const FilterDisplay = ({ ...props }: Props): JSX.Element => {
  const { filter, lookup } = props;

  return (
    <>
      {filter && (
        <section>
          <h4>Filters</h4>
          {formatFilter(filter, lookup)}
        </section>
      )}
    </>
  );
};

const ruleOperator = (operator: string): string => {
  switch (operator) {
    case 'greater':
      return '>';
    case 'less':
      return '<';
    case 'equal':
      return '=';
    case 'not_equal':
      return '≠';

    default:
      return operator;
  }
};

const formatFilter = (
  filter: string,
  lookup: (id: string) => VariableEntity
): JSX.Element => {
  const humanRules: any = [];
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
          data: `${lookup(rule.field).label} ${ruleOperator(rule.operator)} ${
            rule.value
          }`,
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
      <div key={index} className={`level-${box.level}`}>
        {box.data}
      </div>
    );
  });
};

export default FilterDisplay;
