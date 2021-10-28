import * as React from 'react';
import { Navbar, Container, Card } from 'react-bootstrap';
import Filter from './Filter';
import Formula from './Formula';
import { Query } from '../API/Model';
import { VariableEntity } from '../API/Core';
import { IFormula } from '../API/Model';

interface IFilters {
  fields: any;
  filters: any;
  handleUpdateFilter: any;
}

interface IOptions {
  query?: Query;
  handleUpdateFormula: (formula?: IFormula) => void;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
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
  lookup
}: IFilters & IOptions) => {
  const handleUpdateFormulaCallback = React.useCallback(
    handleUpdateFormula,
    []
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
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Options;
