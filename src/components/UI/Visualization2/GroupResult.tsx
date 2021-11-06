import * as React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import {
  GroupResult,
  GroupsResult,
  ResultUnion
} from '../../API/GraphQL/types.generated';
import ResultDispatcher from '../../ExperimentResult/ResultDispatcher';
import Error from '../Error';
import Loader from '../Loader';

interface Props {
  result: GroupsResult;
  loading: boolean;
  error?: Error;
}

const DescriptiveStatistics = ({
  result,
  loading,
  error
}: Props): JSX.Element => {
  return (
    <Card className="result">
      <Card.Body>
        {loading && <Loader />}
        {error && <Error message={error.message} />}
        <Tabs defaultActiveKey={0} id="uncontrolled-mining-tab">
          {result.groups?.map((group: GroupResult, i: number) => {
            return (
              <Tab key={i} eventKey={`${i}`} title={group.name}>
                {group.description && <p>{group.description}</p>}
                {group.results?.map((res: ResultUnion, j: number) => {
                  return <ResultDispatcher result={res} key={j} />;
                })}
              </Tab>
            );
          })}
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default DescriptiveStatistics;
