import * as React from 'react';
import { CSVLink } from 'react-csv';
import { FaFileCsv } from 'react-icons/fa';
import styled from 'styled-components';
import { TableResult } from '../../API/GraphQL/types.generated';

const layouts = ['default', 'statistics'] as const;
export type Layout = typeof layouts[number];

interface TableProps {
  data: TableResult;
  layout?: Layout;
}

interface LayoutProps {
  layout: Layout;
  colsCount: number;
}

const Table = styled.table<LayoutProps>`
  font-family: sans-serif;
  margin-bottom: 5px;
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

const Container = styled.div`
  margin-bottom: 30px;

  .actions {
    font-size: 0.8em;
    display: flex;
    align-items: center;
    margin-bottom: 2px;
  }
`;

export default ({ data, layout = 'default' }: TableProps): JSX.Element => {
  const theme = (data.tableStyle ?? layout) as Layout;
  const csvData = [[...data.headers.map(h => h.name)], ...data.data];

  return (
    <Container className="table-result">
      <CSVLink
        filename={`table-export-${new Date().toJSON().slice(0, 10)}.csv`}
        data={csvData}
        className="float-right actions"
      >
        <FaFileCsv />
        Export as CSV
      </CSVLink>
      <Table
        layout={theme}
        colsCount={data.headers.length}
        key={`table-${data.name}`}
      >
        <thead>
          <tr>
            {data.headers.map((m, i) => (
              <th key={`${data.name}-header-${i}`}>{m.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, i) => (
            <tr key={`${data.name}-row-${i}`}>
              {row.map((value, j) => (
                <td key={`${data.name}-col-${i}-${j}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
