import { CSVLink } from 'react-csv';
import { FaFileCsv } from 'react-icons/fa';
import { round } from '../..//utils';
import styled from 'styled-components';
import { TableResult, TableStyle } from '../../API/GraphQL/types.generated';

const layouts = ['default', 'statistics', 'hierarchical'] as const;
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
  min-width: 50%;
  border-collapse: collapse;
  box-shadow: 0 0 0 1px #e3e3e3;
  border-radius: 2px;
  border: 1px solid #eee;

  tr {
    height: 24px;
  }

  th {
    background: #2b33e9;
    padding: 1px 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    text-align: center;
    border: 1px solid #2b33e9;
    border-bottom: 1px solid #bbb;
    color: white;
    width: ${(prop): string => `${100 / prop.colsCount}%`};
  }

  th:first-child {
    width: 200px !important;
    text-align: left;
  }

  td {
    border: 1px solid #e3e3e3;
    padding: 1px 4px;
    text-overflow: ellipsis;
    text-align: center;
    padding-right: 8px;
  }

  td:first-child {
    font-weight: bold;
    text-align: left;
  }

  ${(prop): string =>
    (prop.layout === TableStyle.Default &&
      `
        tr:nth-child(even) {
          background: #ebebeb;
          padding: 8px;
        }
      `) ||
    ''}

  ${(prop): string =>
    (prop.layout === TableStyle.Statistical &&
      `
      tr:nth-child(1), 
      tr:nth-child(3), 
      tr:last-child {
        border-bottom: 2px solid #1e1e1e;
      }
    `) ||
    ''}

  ${(prop): string =>
    (prop.layout === TableStyle.Hierarchical &&
      `
        tr, th, td { border: 1px solid #999; }
      `) ||
    ''}
`;

const Container = styled.div`
  margin-bottom: 30px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 6px;
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
  const headers2 = data.childHeaders?.reduce<string[]>((acc, curr) => {
    if (curr.names) {
      acc.push(...curr.names);
    } else {
      acc.push(curr.name || '');
    }

    return acc;
  }, []);

  return (
    <Container className="table-result">
      <h1 className="title">
        {data.name}

        <CSVLink
          filename={`table-export-${new Date().toJSON().slice(0, 10)}.csv`}
          data={csvData}
          className="float-right actions"
        >
          <FaFileCsv />
          Export as CSV
        </CSVLink>
      </h1>

      <Table
        layout={data.tableStyle ?? TableStyle.Default}
        colsCount={headers2 ? headers2.length : data.headers.length}
        key={`table-${data.name}`}
      >
        <thead>
          {
            <tr>
              {data.headers.map((m, i) => (
                <th
                  colSpan={
                    (data.childHeaders?.[i]?.names?.length ??
                      data.childHeaders?.[i]?.names?.length) ||
                    1
                  }
                  key={`${data.name}-header-${i}`}
                >
                  {m.name}
                </th>
              ))}
            </tr>
          }
          {headers2 && (
            <tr>
              {headers2?.map((m, i) => (
                <th key={`${m}-sub-header-${i}`}>{m}</th>
              ))}
            </tr>
          )}
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
