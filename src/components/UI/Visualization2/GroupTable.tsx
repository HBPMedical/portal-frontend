import * as React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { GroupsResult, TableResult } from '../../API/generated/graphql';
import DataTable from '../Visualization2/DataTable';
import Loader from '../Loader';
import Error from '../Error';

interface Props {
  results: GroupsResult[];
  loading: boolean;
  error?: Error;
}

const DescriptiveStatistics = ({
  results,
  loading,
  error
}: Props): JSX.Element => {
  console.log(results);
  const singles = results
    ? results[0].groups
        .filter(g => g.name === 'Single')
        .flatMap(g => g.results as TableResult[])
    : [];
  const models = results
    ? results[0].groups
        .filter(g => g.name === 'Model')
        .flatMap(g => g.results as TableResult[])
    : [];

  return (
    <Card className="result">
      <Card.Body>
        <Tabs defaultActiveKey={1} id="uncontrolled-mining-tab">
          <Tab eventKey={'1'} title="Variables">
            <p style={{ marginBottom: '8px' }}>
              Descriptive statistics for the variables of interest.
            </p>
            {loading && <Loader />}
            {error && <Error message={error.message} />}
            <>
              {!results && !loading && <p>Select some data to analyse</p>}
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
              Intersection table for the variables of interest as it appears in
              the experiment.
            </p>
            {models?.map((model, i) => (
              <DataTable key={`model-${i}`} data={model} layout="statistics" />
            ))}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default DescriptiveStatistics;
