import React, { useCallback, useMemo } from 'react';
import { Card, Container, Navbar } from 'react-bootstrap';
import { APICore } from '../API';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { Domain, Experiment, Variable } from '../API/GraphQL/types.generated';
import { IFormula } from '../API/Model';
import Filter from './Filter';
import Formula from './Formula';

interface IFilters {
  fields: any;
  filters: any;
}

interface IOptions {
  domain: Domain;
  apiCore: APICore;
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
  localMutations.updateDraftExperiment({
    formula
  });
};

const Options = ({
  fields,
  filters,
  apiCore,
  experiment,
  domain
}: IFilters & IOptions): JSX.Element => {
  const lookup = useCallback(
    (id: string): Variable | undefined =>
      domain.variables.find(v => v.id === id),
    [domain]
  );

  const handleUpdateFormulaCallback = React.useCallback(handleUpdateFormula, [
    experiment.formula // hacky way to force re-render on formula changes
  ]);
  // Avoid re-rendering of formula and losing focus on select input
  const memoizedAlgorithms = useMemo(
    () =>
      apiCore.state.algorithms?.filter(a =>
        a.parameters.find((p: any) => p.type === 'formula_description')
      ),
    [apiCore.state.algorithms]
  );

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
            handleUpdateFormula={handleUpdateFormulaCallback}
            availableAlgorithms={memoizedAlgorithms}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Options;
