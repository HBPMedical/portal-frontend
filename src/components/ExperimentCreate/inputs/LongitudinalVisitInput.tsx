import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import {
  AllowedLink,
  Experiment,
  NominalParameter,
  OptionValue,
  Variable,
} from '../../API/GraphQL/types.generated';

type Props = {
  parameter: NominalParameter;
  handleValueChanged: (key: string, value?: string) => void;
  experiment?: Experiment;
  variables?: Variable[];
};

const getLinkedVar = (
  parameter: NominalParameter,
  exp?: Experiment,
  vars?: Variable[]
): Variable | undefined => {
  if (!exp || !vars) return undefined;

  const idCandidates = parameter?.allowedValues?.map((v) => v.label) ?? [];
  const variable = vars.find(
    (v) => idCandidates.includes(v.id) && v.type === 'nominal'
  );

  if (variable && variable.enumerations) {
    return variable;
  }

  return undefined;
};

const LongitudinalVisitInput = ({
  parameter,
  experiment,
  variables,
  handleValueChanged,
}: Props) => {
  const isLinked = parameter.linkedTo;
  const [linkedVar, setLinkedVar] = useState<Variable | undefined>(undefined);
  const [options, setOptions] = useState<OptionValue[]>([]);

  const title = `${parameter.label ?? parameter.name} ${
    isLinked ? `(${linkedVar?.label})` : ''
  }`;
  const helper = [parameter.hint];

  useEffect(() => {
    const linkedVar = getLinkedVar(parameter, experiment, variables);
    if (!linkedVar || !linkedVar.enumerations) return;

    setLinkedVar(linkedVar);
    const opts: OptionValue[] = linkedVar.enumerations.map((e) => ({
      value: e.value,
      label: e.label ?? e.value,
    }));

    setOptions(opts);
  }, [experiment, parameter, variables]);

  if (parameter.isRequired) helper.push('Required');

  if (options.length === 0) return <></>;

  return (
    <Form.Group controlId="algo.params.SelectCustom">
      <Form.Label>{title}</Form.Label>
      {!parameter.hasMultiple && (
        <Form.Control
          required={parameter.isRequired ?? false}
          as="select"
          custom
          onChange={(e) => handleValueChanged?.(parameter.name, e.target.value)}
          defaultValue={parameter.defaultValue ?? undefined}
          multiple={parameter.hasMultiple ?? undefined}
        >
          <option value="">Select an option</option>
          {options.map((opt) => {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </Form.Control>
      )}
      {parameter.hasMultiple && (
        <Select
          onChange={(values) =>
            handleValueChanged?.(
              parameter.name,
              values?.map((v) => v.value).toString() ?? ''
            )
          }
          options={options.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
          isMulti={true}
        />
      )}
      {helper.map((text, i) => (
        <Form.Text key={i} className="text-muted">
          {text}
        </Form.Text>
      ))}
    </Form.Group>
  );
};

export default LongitudinalVisitInput;
