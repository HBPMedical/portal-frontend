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

const StyledTable = styled.table`
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

interface Props {
  summaryStatistics?: MiningResponse[];
  selectedDatasets?: Variable[];
  query?: Query;
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
}

const getRound = (value: number): string => round(value, 2);

const Table = ({
  summaryStatistics,
  selectedDatasets,
  query,
  lookup
}: Props): JSX.Element => {
  const single =
    (summaryStatistics &&
      summaryStatistics.length > 0 &&
      summaryStatistics[0].data['single']) ||
    null;
  const singleVarKeys = single && Object.keys(single);

  const tables = singleVarKeys?.map((varKey: string) => {
    const varData = (single && single[varKey]) || {};
    const datasetKeys = Object.keys(varData);
    const dataKeys = Array.from(
      new Set(
        datasetKeys
          .map(k => Object.keys(varData[k].data))
          .reduce((p, c) => [...p, ...c])
      )
    );

    return {
      level1: [
        varKey,
        ...datasetKeys.map(datasetKey => varData[datasetKey].num_total)
      ],
      level2: [
        [
          'Datapoints',
          ...datasetKeys.map(
            datasetKey => `${varData[datasetKey].num_datapoints}`
          )
        ],
        [
          'Nulls',
          ...datasetKeys.map(datasetKey => `${varData[datasetKey].num_nulls}`)
        ]
      ],
      level3: [
        ...dataKeys.map(key => [
          key,
          ...datasetKeys.map(datasetKey => {
            if (!(varData[datasetKey]?.data as CategoricalData)[key]) {
              return 0;
            }

            return (varData[datasetKey].data as CategoricalData)[key].count
              ? `${(varData[datasetKey].data as CategoricalData)[key].count}`
              : `${varData[datasetKey].data[key]}`;
          })
        ])
      ]
    };
  });

  const error =
    summaryStatistics &&
    summaryStatistics.find(
      r => r.type && ERRORS_OUTPUT.includes(r.type as MIME_TYPES)
    );

  return (
    <>
      {error && <Error message={'error.data'} />}
      {!error && (
        <Tabs defaultActiveKey={1} id="uncontrolled-mining-tab">
          <Tab eventKey={'1'} title="Variables">
            <p style={{ marginBottom: '8px' }}>
              Descriptive statistics for the variables of interest. The layout
              is mean, std, [min, max].
            </p>
            {tables?.map(data => (
              <StyledTable>
                <thead>
                  <tr>
                    {/* {header.map(value => (
                      <th>{value}</th>
                    ))} */}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '2px grey solid ' }}>
                    {data.level1.map((value, i) => (
                      <td key={`level1-td-${i}`}>{value}</td>
                    ))}
                  </tr>
                  {data.level2.map((row, i) => (
                    <tr
                      style={{
                        borderBottom:
                          i === data.level2.length - 1 ? '2px grey solid ' : '0'
                      }}
                      key={`level2-tr-${i}`}
                    >
                      {row.map((value, i) => (
                        <td key={`level2-td-${i}`}>{value}</td>
                      ))}
                    </tr>
                  ))}
                  {data.level3.map((row, i) => (
                    <tr
                      style={{
                        borderBottom:
                          i === data.level3.length - 1 ? '2px grey solid ' : '0'
                      }}
                      key={`level3-tr--${i}`}
                    >
                      {row.map((value, i) => (
                        <td key={`level3-td-${i}`}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            ))}
          </Tab>
          <Tab eventKey={'2'} title="Model">
            <p style={{ marginBottom: '8px' }}>
              Intersection table for the variables of interest as it appears in
              the experiment. The layout is mean, std, [min, max].
            </p>
            {/* <DataTable value={rows2}>{columns2}</DataTable> */}
          </Tab>
        </Tabs>
      )}
    </>
  );
};

export default Table;
