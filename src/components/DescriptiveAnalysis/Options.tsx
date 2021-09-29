import * as React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Filter from './Filter';
import AdHocVariables from './AdHocVariables';
import { Query } from '../API/Model';
import { VariableEntity } from '../API/Core';

interface IFilters {
  fields: any;
  filters: any;
  handleUpdateFilter: any;
}

interface IOptions {
  query?: Query;
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
    <AdHocVariables query={query} lookup={lookup} />
  </>
);

export default Options;
