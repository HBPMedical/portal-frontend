import React, { useCallback } from 'react';
import { Card, Container, Navbar } from 'react-bootstrap';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useListAlgorithmsQuery } from '../API/GraphQL/queries.generated';
import { Domain, Experiment, Variable } from '../API/GraphQL/types.generated';
import { IFormula } from '../API/Model';
import Filter from './Filter';
import Formula from './FormulaContainer';

interface IOptions {
  domain: Domain;
  experiment: Experiment;
}

const NavBar = (): JSX.Element => (
  <Navbar bg="info" variant="dark">
    <Container>
      <Navbar.Brand>Filters and Formula</Navbar.Brand>
    </Container>
  </Navbar>
);

const handleUpdateFilter = (data: string): void => {
  const filter = (data && JSON.stringify(data)) || '';
  localMutations.updateDraftExperiment({
    filter
  });
};

const handleUpdateFormula = (formula?: IFormula): void => {
  localMutations.updateDraftExperiment({ formula });
};

const FilterFormulaWrapper = ({
  experiment,
  domain
}: IOptions): JSX.Element => {
  const lookup = useCallback(
    (id: string): Variable | undefined =>
      domain.variables.find(v => v.id === id),
    [domain]
  );

  const { data } = useListAlgorithmsQuery();
  const availableAlgorithms = data?.algorithms.filter(a => a.hasFormula) ?? [];

  const handleUpdateFormulaCallback = React.useCallback(handleUpdateFormula, [
    experiment.formula // hacky way to force re-render on formula changes
  ]);

  const makeFilters = (): any => {
    // FIXME: move to Filter, refactor in a pure way
    let fields = [];
    const buildFilter = (code: string): any => {
      if (!domain || !domain.variables) {
        return [];
      }

      const originalVar = domain.variables.find(v => v.id === code);

      if (!originalVar) {
        return [];
      }

      const output: any = {
        id: originalVar.id,
        label: originalVar.label || originalVar.id,
        name: originalVar.id,
        //default input type: text
        type: 'string',
        output: 'text',
        operators: ['equal', 'not_equal']
      };

      if (
        originalVar &&
        originalVar.enumerations &&
        originalVar.enumerations.length > 0
      ) {
        output.values = originalVar.enumerations.map(c => ({
          [c.value]: c.label || c.value
        }));
        output.input = 'select';
        output.operators = ['equal', 'not_equal', 'in', 'not_in'];
      }

      const type = originalVar && originalVar.type;
      if (type && ['real', 'integer'].includes(type)) {
        output.type = 'double';
        output.input = 'number';
        output.operators = [
          'equal',
          'not_equal',
          'less',
          'greater',
          'between',
          'not_between'
        ];
      }

      return output;
    };

    const allVariables = experiment.filterVariables || [];

    // add filter variables
    const extractVariablesFromFilter = (filter: any): any =>
      filter.rules.forEach((r: any) => {
        if (r.rules) {
          extractVariablesFromFilter(r);
        }
        if (r.id) {
          allVariables.push(r.id);
        }
      });

    if (experiment && experiment.filter) {
      extractVariablesFromFilter(JSON.parse(experiment.filter));
    }

    const allUniqVariables = Array.from(new Set(allVariables));
    fields =
      (domain?.variables &&
        [...allUniqVariables.map(buildFilter)].filter((f: any) => f.id)) ||
      [];
    const filters =
      (experiment && experiment.filter && JSON.parse(experiment.filter)) || '';

    return { filters, fields };
  };

  const { fields, filters } = makeFilters();

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
            experiment={experiment}
            lookup={lookup}
            availableAlgorithms={availableAlgorithms}
            handleUpdateFormula={handleUpdateFormulaCallback}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default FilterFormulaWrapper;
