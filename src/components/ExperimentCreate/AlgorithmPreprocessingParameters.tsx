import { useCallback, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import {
  Algorithm,
  Domain,
  Experiment,
  NominalParameter,
  Variable,
} from '../API/GraphQL/types.generated';
import { Dict } from '../utils';
import LongitudinalVisitInput from './inputs/LongitudinalVisitInput';
import NominalInput from './inputs/NominalInput';

const Header = styled.div`
  margin-bottom: 16px;

  h4 {
    margin-bottom: 4px;
  }
`;

type Props = {
  experiment: Experiment;
  domain?: Domain;
  algorithm?: Algorithm;
  variables?: Variable[];
  handlePreprocessingChanged: (
    name: string,
    key: string,
    value?: string
  ) => void;
  handleFormValidationChange: (status: boolean) => void;
};

const AlgorithmPreprocessingParameters = ({
  experiment,
  domain,
  algorithm,
  variables = [],
  handlePreprocessingChanged,
  handleFormValidationChange,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    handleFormValidationChange(formRef.current?.checkValidity() ?? true);
  }, [algorithm, formRef, handleFormValidationChange]);

  const lookup = useCallback(
    (id: string): Variable | undefined =>
      domain?.variables.find((v) => v.id === id),
    [domain]
  );

  const lookupVariable = (experiment: Experiment): Variable[] =>
    [...experiment.variables, ...(experiment.coVariables ?? [])].map((c) => {
      const v = lookup(c);

      return {
        type: v?.type ?? 'string',
        id: v?.id ?? c,
        label: v?.label ?? c,
      };
    });

  return (
    <div>
      {algorithm?.preprocessing?.map((preprocessing) => (
        <div key={preprocessing.name}>
          <p>
            <strong>{preprocessing.label}</strong>
          </p>
          <Header>
            {preprocessing?.parameters?.length === 0 && (
              <div>No parameters needed</div>
            )}

            {preprocessing?.parameters?.length !== 0 && (
              <Form
                validated={true}
                ref={formRef}
                onChange={() =>
                  handleFormValidationChange(
                    formRef.current?.checkValidity() ?? true
                  )
                }
              >
                {preprocessing?.parameters
                  ?.map((parameters) => {
                    const type = (parameters as unknown as Dict).__typename;
                    const id = `${algorithm.id}-${parameters.name}`;

                    if (
                      type === 'NominalParameter' &&
                      parameters.name === 'strategies'
                    ) {
                      const vars = lookupVariable(experiment);
                      return vars.map((c) => {
                        let param = parameters as NominalParameter;
                        if (c.type === 'nominal') {
                          param = {
                            ...parameters,
                            allowedValues: param.allowedValues?.filter(
                              (o) => o.value !== 'diff'
                            ),
                          };
                        }

                        return (
                          <NominalInput
                            key={`${algorithm.id}-${param.name}-${c}`}
                            parameter={
                              {
                                ...param,
                                label: `Strategy for ${c.label}`,
                                name: c.id,
                              } as NominalParameter
                            }
                            experiment={experiment}
                            variables={variables}
                            handleValueChanged={(
                              key: string,
                              value?: string
                            ) => {
                              if (preprocessing.name)
                                handlePreprocessingChanged(
                                  preprocessing.name,
                                  key,
                                  value
                                );
                            }}
                          />
                        );
                      });
                    }

                    if (type === 'NominalParameter')
                      return (
                        <LongitudinalVisitInput
                          key={id}
                          parameter={parameters as NominalParameter}
                          experiment={experiment}
                          variables={variables}
                          handleValueChanged={(key: string, value?: string) => {
                            if (preprocessing.name)
                              handlePreprocessingChanged(
                                preprocessing.name,
                                key,
                                value
                              );
                          }}
                        />
                      );

                    return undefined;
                  })
                  .filter((input) => input !== undefined)}
              </Form>
            )}
          </Header>
        </div>
      ))}
    </div>
  );
};

export default AlgorithmPreprocessingParameters;
