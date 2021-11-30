import React, { useMemo } from 'react';
import { Card, Container, Navbar } from 'react-bootstrap';
import { APICore } from '../API';
import { VariableEntity } from '../API/Core';
import { IFormula, Query } from '../API/Model';
import Filter from './Filter';
import Formula from './Formula';

interface IFilters {
  fields: any;
  filters: any;
  handleUpdateFilter: any;
}

interface IOptions {
  query?: Query;
  handleUpdateFormula: (formula?: IFormula) => void;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
  apiCore: APICore;
}

const NavBar = () => (
  <Navbar bg="info" variant="dark">
    <Container>
      <Navbar.Brand>Filters and Formula</Navbar.Brand>
    </Container>
  </Navbar>
);

const Options = ({
  fields,
  filters,
  handleUpdateFilter,
  handleUpdateFormula,
  query,
  lookup,
  apiCore
}: IFilters & IOptions) => {
  const handleUpdateFormulaCallback = React.useCallback(handleUpdateFormula, [
    query?.formula // hacky way to force re-render on formula changes
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
            query={query}
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
