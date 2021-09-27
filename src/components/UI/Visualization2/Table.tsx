import * as React from 'react';
import styled from 'styled-components';

export interface ITable {
  profile: 'tabular-data-resource';
  name: string;
  data: (string | number)[][];
  schema: {
    fields: {
      type: string;
      name: string;
    }[];
  };
}

interface TableProps {
  table: ITable;
  layout?: 'default' | 'statistics';
}

interface LayoutProps {
  layout: 'default' | 'statistics';
  colsCount: number;
}

const DataTable = styled.table<LayoutProps>`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin-bottom: 32px;
  table-layout: fixed;
  white-space: nowrap;
  min-width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 0 1px #e3e3e3;
  border-radius: 2px;
  border: 1px solid #eee;

  tr {
    height: 24px;
  }

  th {
    background: #ebebeb;
    padding: 1px 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    text-align: center;
    border: 1px solid #e3e3e3;
    border-bottom: 1px solid #bbb;
    width: ${(prop): string => `${100 / prop.colsCount}%`};
  }

  th:first-child {
    border-left: 1px solid #eee;
    width: 200px !important;
    text-align: left;
  }

  ${(prop): string =>
    prop.layout === 'default'
      ? `
        tr:nth-child(even) {
          background: #ebebeb;
          padding: 8px;
        }
      `
      : `
      tr:nth-child(1), 
      tr:nth-child(3), 
      tr:last-child {
        border-bottom: 2px solid #1e1e1e;
      }
    `}

  td {
    border: 1px solid #e3e3e3;
    padding: 1px 4px;
    text-overflow: ellipsis;
    text-align: center;
  }

  td:first-child {
    font-weight: bold;
    text-align: left;
  }
`;

const Table = ({ table, layout = 'default' }: TableProps): JSX.Element => (
  <DataTable
    layout={layout}
    colsCount={table.schema.fields.length}
    key={`table-${table.name}`}
  >
    <thead>
      <tr>
        {table.schema.fields.map((field, i) => (
          <th key={`${table.name}-header-${i}`}>{field.name}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {table.data.map((row, i) => (
        <tr key={`${table.name}-row-${i}`}>
          {row.map((data, j) => (
            <td key={`${table.name}-col-${i}-${j}`}>{data}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </DataTable>
);

export default Table;
