import * as React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Filter from './Filter';
import AdHocVariables from './AdHocVariables';
import { Query } from '../API/Model';
import { VariableEntity } from '../API/Core';
import { IFormula } from './Container';

interface IFilters {
  fields: any;
  filters: any;
  handleUpdateFilter: any;
}

interface IOptions {
  query?: Query;
  setFormula: React.Dispatch<React.SetStateAction<IFormula>>;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
}

const NavBar = () => (
  <Navbar bg="info" variant="dark">
    <Container>
      <Navbar.Brand>Options</Navbar.Brand>
    </Container>
  </Navbar>
);

const Options = ({
  fields,
  filters,
  handleUpdateFilter,
  setFormula,
  query,
  lookup
}: IFilters & IOptions) => (
  <>
    <NavBar />
    <Filter
      rules={filters}
      filters={fields}
      handleChangeFilter={handleUpdateFilter}
    />
    <AdHocVariables query={query} lookup={lookup} setFormula={setFormula} />
  </>
);

export default Options;
