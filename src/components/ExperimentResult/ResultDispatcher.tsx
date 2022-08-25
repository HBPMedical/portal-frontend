import React from 'react';
import styled from 'styled-components';
import {
  AlertResult,
  BarChartResult,
  GroupsResult,
  HeatMapResult,
  LineChartResult,
  MeanChartResult,
  RawResult,
  ResultUnion,
  TableResult
} from '../API/GraphQL/types.generated';
import GroupResult from '../UI/Visualization2/GroupResult';
import ExportResult from '../UI/Export/ExportResult';
import ResultsErrorBoundary from '../UI/ResultsErrorBoundary';
import BarGraph from '../UI/Visualization2/BarGraph';
import DataTable from '../UI/Visualization2/DataTable';
import HeatMapChart from '../UI/Visualization2/HeatMapChart';
import LineGraph from '../UI/Visualization2/LineGraph';
import MeanPlot from '../UI/Visualization2/MeanPlot';
import RenderResult from './RenderResult';
import { Result } from '../utils';
import AlertDisplay from '../UI/Visualization2/AlertDisplay';

type Props = {
  result: ResultUnion;
  constraint?: boolean;
  allowExport?: boolean;
};

type Switcher = {
  [key: string]: (data?: ResultUnion, constraint?: boolean) => React.ReactNode;
};

type ContainerProps = {
  hasExport: boolean;
};

const ContainerResult = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: ${p => (p.hasExport ? '20px' : '0')};
`;

const children = {
  tableresult: data => <DataTable data={data as TableResult} />,
  rawresult: (data, constraint) => (
    <ResultsErrorBoundary>
      <RenderResult
        results={[(data as RawResult)?.rawdata] as Result[]}
        constraint={constraint ?? true}
      />
    </ResultsErrorBoundary>
  ),
  heatmapresult: data => <HeatMapChart data={data as HeatMapResult} />,
  linechartresult: data => <LineGraph data={data as LineChartResult} />,
  meanchartresult: data => <MeanPlot data={data as MeanChartResult} />,
  barchartresult: data => <BarGraph data={data as BarChartResult} />,
  groupsresult: data => (
    <GroupResult result={data as GroupsResult} loading={false} />
  ),
  alertresult: data => <AlertDisplay data={data as AlertResult} />,
  error: () => <div> An error occured </div>
} as Switcher;

const ResultDispatcher = ({
  result,
  constraint,
  allowExport = true
}: Props) => {
  return (
    <ExportResult result={result} allowExport={allowExport}>
      {(data, type) => (
        <ContainerResult
          hasExport={allowExport}
          className="exp-result"
          data-export={type === 'tableresult' ? 'container' : 'inplace'}
        >
          {children[type] && children[type](data, constraint)}
        </ContainerResult>
      )}
    </ExportResult>
  );
};

export default ResultDispatcher;
