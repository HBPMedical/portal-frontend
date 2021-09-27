import * as React from 'react';
import { Card } from 'react-bootstrap';

import { APIMining } from '../API';
import { VariableEntity } from '../API/Core';
import { ModelResponse } from '../API/Model';
import { Alert } from '../UI/Alert';
import Table, { ITable } from '../UI/Visualization2/Table';
import { Tab, Tabs } from 'react-bootstrap';

interface Props {
  apiMining?: APIMining;
  model?: ModelResponse;
  selectedDatasets?: VariableEntity[];
  lookup: (code: string, pathologyCode: string | undefined) => VariableEntity;
  children: any;
}

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

const Content = ({
  apiMining,
  model,
  selectedDatasets,
  lookup,
  children
}: Props): JSX.Element => (
  <>
    {apiMining && apiMining.state && apiMining.state.error && (
      <Alert
        message={apiMining.state && apiMining.state.error}
        title={'Error'}
        styled={'info'}
      />
    )}
    {apiMining && (
      <Card>
        <Card.Body>
          {children}
          <Card>
            <Card.Body>
              <Tabs defaultActiveKey={1} id="uncontrolled-mining-tab">
                <Tab eventKey={'1'} title="Variables">
                  <p style={{ marginBottom: '8px' }}>
                    Descriptive statistics for the variables of interest.
                  </p>
                  <>
                    {(!selectedDatasets || selectedDatasets.length === 0) && (
                      <p>Select some data to analyse</p>
                    )}
                    {tables &&
                      tables.map((table, i) => (
                        <Table key={`table-${i}`} table={table} layout="statistics" />
                      ))}
                  </>
                </Tab>
                <Tab eventKey={'2'} title="Model">
                  <p style={{ marginBottom: '8px' }}>
                    Intersection table for the variables of interest as it
                    appears in the experiment.
                  </p>
                  {tables &&
                    tables.map((table, i) => (
                      <Table key={`table-${i}`} table={table} layout="statistics" />
                    ))}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    )}
  </>
);
export default Content;
