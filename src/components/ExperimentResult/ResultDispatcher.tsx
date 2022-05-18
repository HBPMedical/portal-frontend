import React from 'react';
import styled from 'styled-components';
import { Result } from '../API/Experiment';
import {
  GroupsResult,
  HeatMapResult,
  RawResult,
  ResultUnion,
  TableResult
} from '../API/GraphQL/types.generated';
import ResultsErrorBoundary from '../UI/ResultsErrorBoundary';
import DataTable from '../UI/Visualization2/DataTable';
import GroupTable from '../UI/Visualization2/GroupResult';
import HeatMapChart from '../UI/Visualization2/HeatMapChart';
import RenderResult from './RenderResult';

type Props = {
  result: ResultUnion;
  constraint?: boolean;
};

type Switcher = {
  [key: string]: JSX.Element;
};

const ContainerResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class ResultDispatcher extends React.Component<Props> {
  render(): JSX.Element {
    const type: string = (
      this.props.result.__typename ?? 'error'
    ).toLowerCase();
    const { result, constraint } = this.props;
    const children = ({
      groupsresult: (
        <GroupTable result={result as GroupsResult} loading={false} />
      ),
      tableresult: <DataTable data={result as TableResult} />,
      rawresult: (
        <ResultsErrorBoundary>
          <RenderResult
            results={[(result as RawResult)?.rawdata] as Result[]}
            constraint={constraint ?? true}
          />
        </ResultsErrorBoundary>
      ),
      heatmapresult: <HeatMapChart data={result as HeatMapResult} />,
      error: <div> An error occured </div>
    } as Switcher)[type];
    if (!children) return <></>;
    return (
      <ContainerResult className={type !== 'groupsresult' ? 'exp-result' : ''}>
        {children}
      </ContainerResult>
    );
  }
}

export default ResultDispatcher;
