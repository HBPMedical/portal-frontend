import './Table.css';

import * as React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Variable, VariableEntity } from '../API/Core';
import { MiningResponse, CategoricalData } from '../API/Mining';
import { Query } from '../API/Model';
import { ERRORS_OUTPUT, MIME_TYPES, PRIVACY_ERROR } from '../constants';
import Error from '../UI/Error';
import styled from 'styled-components';

import { round } from '../utils';

const DataTable = styled.table`
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

  tr:nth-child(even) {
    background: #ebebeb;
    padding: 8px;
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
  }

  th:first-child {
    border-left: 1px solid #eee;
    width: 200px !important;
    text-align: left;
  }

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

const Title = styled.h5`
  margin-bottom: 8px;
`;

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

interface Props {
  summaryStatistics?: MiningResponse[];
  selectedDatasets?: Variable[];
  query?: Query;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
}

// const getRound = (value: number): string => round(value, 2);

const Table = ({
  summaryStatistics,
  selectedDatasets,
  query,
  lookup
}: Props): JSX.Element => {
  const error =
    summaryStatistics &&
    summaryStatistics.find(
      r => r.type && ERRORS_OUTPUT.includes(r.type as MIME_TYPES)
    );

  const schema = {
    fields: [
      {
        type: 'string',
        name: ''
      },
      {
        type: 'string',
        name: 'DESD-synthdata'
      },
      {
        type: 'string',
        name: 'EDSD'
      },
      {
        type: 'string',
        name: 'PPMI'
      }
    ]
  };

  const table: ITable = {
    profile: 'tabular-data-resource',
    name: 'left-anterior-cingulate-gyrus',
    data: [
      ['Left anterior cingulate gyrus', 714, 474, 1000],
      ['Datapoints', 714, 437, 920],
      ['Nulls', 0, 37, 80],
      ['std', 0.56, 0.696, 0.7897],
      ['max', 6.71, 6.534, 6.534],
      ['min', 3.16, 0.001, 0.001],
      ['mean', 4.687, 4.45, 4.44]
    ],
    schema: schema
  };

  const tables = [table, table, table];

  return (
    <>
      {error && <Error message={'error.data'} />}
      {!error && (
        <Tabs defaultActiveKey={1} id="uncontrolled-mining-tab">
          <Tab eventKey={'1'} title="Variables">
            <p style={{ marginBottom: '8px' }}>
              Descriptive statistics for the variables of interest.
            </p>
            <>
              {tables.map(table => (
                <DataTable key={`table-${table.name}`}>
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
              ))}
            </>
          </Tab>
          <Tab eventKey={'2'} title="Model">
            <p style={{ marginBottom: '8px' }}>
              Intersection table for the variables of interest as it appears in
              the experiment.
            </p>
            {/* <DataTable value={rows2}>{columns2}</DataTable> */}
          </Tab>
        </Tabs>
      )}
    </>
  );
};

export default Table;
