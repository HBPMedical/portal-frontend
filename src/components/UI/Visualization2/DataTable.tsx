import { CSVLink } from 'react-csv';
import { FaFileCsv } from 'react-icons/fa';
import { round } from 'src/components/utils';
import styled from 'styled-components';
import { TableResult, TableStyle } from '../../API/GraphQL/types.generated';

const layouts = ['default', 'statistics'] as const;
export type Layout = typeof layouts[number];

interface TableProps {
  data: TableResult;
}

interface LayoutProps {
  layout: TableStyle;
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
    prop.layout === TableStyle.Default
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
    text-align: right;
    padding-right: 8px;
  }

  td:first-child {
    font-weight: bold;
    text-align: left;
  }
`;

const Container = styled.div`
  margin-bottom: 30px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .actions {
    font-size: 0.6em;
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    font-weight: normal;
  }
`;

const DataTable = ({ data }: TableProps): JSX.Element => {
  const csvData = [[...data.headers.map((h) => h.name)], ...data.data];

  return (
    <Container className="table-result">
      <h5 className="title">
        {data.name}

        <CSVLink
          filename={`table-export-${new Date().toJSON().slice(0, 10)}.csv`}
          data={csvData}
          className="float-right actions"
        >
          <FaFileCsv />
          Export as CSV
        </CSVLink>
      </h5>

      <Table
        layout={data.tableStyle ?? TableStyle.Normal}
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
                <td key={`${data.name}-col-${i}-${j}`}>{round(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DataTable;
