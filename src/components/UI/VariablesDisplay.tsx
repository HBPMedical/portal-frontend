import * as React from 'react';

import { VariableEntity } from '../API/Core';

interface Props {
  title: string;
  variables?: string[];
  lookup: (id: string) => VariableEntity;
}

const VariablesDisplay = ({ ...props }: Props): JSX.Element => {
  const { variables, title, lookup } = props;

  return (
    <>
      {variables && variables.length > 0 && (
        <>
          <section>
            <h4>{title}</h4>
            {variables.map((variable, i) => (
              <p key={i}>{lookup(variable).info}</p>
            ))}
          </section>
        </>
      )}
    </>
  );
};

export default VariablesDisplay;
