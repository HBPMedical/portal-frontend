import * as React from 'react';
import { Button, Card, Tab, Tabs } from 'react-bootstrap';
import { TableResult } from '../../API/generated/graphql';
import DataTable from '../Visualization2/DataTable';
import Loader from '../Loader';
import Error from '../Error';
import { Component } from 'react-router/node_modules/@types/react';

interface Props {
  results: TableResult[];
  loading: boolean;
  error?: Error;
}

const DescriptiveStatistics = ({
  results,
  loading,
  error
}: Props): JSX.Element => {
  const singles = results?.filter(r => r.groupBy === 'single');
  const models = results?.filter(r => r.groupBy === 'model');

  return (
    <Card>
      <Card.Body>
        <Card>
          <Card.Body>
            <Tabs defaultActiveKey={1} id="uncontrolled-mining-tab">
              <Tab eventKey={'1'} title="Variables">
                <p style={{ marginBottom: '8px' }}>
                  Descriptive statistics for the variables of interest.
                </p>
                {loading && <Loader />}
                {error && <Error message={error.message} />}
                <>
                  {!results && <p>Select some data to analyse</p>}
                  {singles?.map((single, i) => (
                    <DataTable
                      key={`single-${i}`}
                      data={single}
                      layout="statistics"
                    />
                  ))}
                </>
              </Tab>
              <Tab eventKey={'2'} title="Model">
                <p style={{ marginBottom: '8px' }}>
                  Intersection table for the variables of interest as it appears
                  in the experiment.
                </p>
                {models?.map((model, i) => (
                  <DataTable
                    key={`model-${i}`}
                    data={model}
                    layout="statistics"
                  />
                ))}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default DescriptiveStatistics;
