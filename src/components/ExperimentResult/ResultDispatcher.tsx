import React from 'react';
import { Result } from '../API/Experiment';
import {
  GroupsResult,
  RawResult,
  ResultUnion,
  TableResult
} from '../API/GraphQL/types.generated';
import DataTable from '../UI/Visualization2/DataTable';
import GroupTable from '../UI/Visualization2/GroupResult';
import RenderResult from './RenderResult';

type Props = {
  result: ResultUnion;
};

type Switcher = {
  [key: string]: JSX.Element;
};

class ResultDispatcher extends React.Component<Props> {
  render(): JSX.Element {
    const type: string = (
      this.props.result.__typename ?? 'error'
    ).toLowerCase();
    const { result } = this.props;
    return (
      <>
        {
          ({
            groupsresult: (
              <GroupTable result={result as GroupsResult} loading={false} />
            ),
            tableresult: (
              <DataTable data={result as TableResult} layout="statistics" />
            ),
            rawresult: (
              <RenderResult
                results={[(result as RawResult).rawdata] as Result[]}
              />
            ),
            error: <div> An error occured </div>
          } as Switcher)[type]
        }
      </>
    );
  }
}

export default ResultDispatcher;
