/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { Card, Container, Navbar } from 'react-bootstrap';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useGetFilterFormulaDataQuery } from '../API/GraphQL/queries.generated';
import { Domain, Experiment, Variable } from '../API/GraphQL/types.generated';
import { IFormula } from '../utils';
import Filter from './Filter';
import Formula from './FormulaContainer';

interface IOptions {
  domain: Domain;
  experiment: Experiment;
}

const NavBar = (): JSX.Element => (
  <Navbar bg="primary" variant="dark">
    <Container>
      <Navbar.Brand>Filters and Formula</Navbar.Brand>
    </Container>
  </Navbar>
);

const handleUpdateFilter = (data: string): void => {
  const filter = (data && JSON.stringify(data)) || '';
  localMutations.updateDraftExperiment({
    filter,
  });
};

const handleUpdateFormula = (formula?: IFormula): void => {
  localMutations.updateDraftExperiment({ formula });
};

const FilterFormulaWrapper = ({
  experiment,
  domain,
}: IOptions): JSX.Element => {
  const lookup = useCallback(
    (id: string): Variable | undefined =>
      domain.variables.find((v) => v.id === id),
    [domain]
  );

  const { data } = useGetFilterFormulaDataQuery();
  const availableAlgorithmsWithFormula =
    data?.algorithms.filter((a) => a.hasFormula).map((a) => a.label ?? a.id) ??
    [];
  const numberTypes = data?.filter?.numberTypes ?? [];

  const handleUpdateFormulaCallback = React.useCallback(handleUpdateFormula, [
    experiment.formula, // hacky way to force re-render on formula changes
  ]);

  const makeFilters = (): any => {
    // FIXME: move to Filter, refactor in a pure way
    let varFields = [];
    const buildFilter = (code: string) => {
      if (!domain || !domain.variables) {
        return [];
      }

      const originalVar = domain.variables.find((v) => v.id === code);

      if (!originalVar) {
        return [];
      }

      const output: any = {
        id: originalVar.id,
        label: originalVar.label || originalVar.id,
        name: originalVar.id,
        //default input type: text
        type: 'string',
        input: 'text',
        operators: ['equal', 'not_equal'],
      };

      if (
        originalVar &&
        originalVar.enumerations &&
        originalVar.enumerations.length > 0
      ) {
        output.values = originalVar.enumerations.map((c) => ({
          [c.value]: c.label || c.value,
        }));
        output.input = 'select';
        output.operators = ['equal', 'not_equal', 'in', 'not_in'];
      }

      const type = originalVar && originalVar.type;
      if (type && numberTypes.includes(type)) {
        output.type = 'double';
        output.input = 'number';
        output.operators = [
          'equal',
          'not_equal',
          'less',
          'greater',
          'between',
          'not_between',
        ];
      }

      return output;
    };

    varFields =
      (experiment.filterVariables &&
        [...experiment.filterVariables.map(buildFilter)].filter((f) => f.id)) ||
      [];
    const expFilters =
      (experiment && experiment.filter && JSON.parse(experiment.filter)) || '';

    return { filters: expFilters, fields: varFields };
  };

  const { filters, fields } = makeFilters();

  return (
    <>
      <NavBar />
      <Card>
        <Card.Body>
          <Filter
            rules={filters}
            filters={fields}
            handleChangeFilter={handleUpdateFilter}
          />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Formula
            operations={data?.formula ?? []}
            experiment={experiment}
            lookup={lookup}
            availableAlgorithmsWithFormula={availableAlgorithmsWithFormula}
            handleUpdateFormula={handleUpdateFormulaCallback}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default FilterFormulaWrapper;
