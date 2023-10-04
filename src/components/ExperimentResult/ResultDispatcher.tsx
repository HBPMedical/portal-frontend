import React from 'react';
import {
  AlertResult,
  BarChartResult,
  ClusterResult,
  GroupsResult,
  HeatMapResult,
  LineChartResult,
  MeanChartResult,
  RawResult,
  ResultUnion,
  TableResult,
} from '../API/GraphQL/types.generated';
import ExportResult from '../UI/Export/ExportResult';
import ResultsErrorBoundary from '../UI/ResultsErrorBoundary';
import AlertDisplay from '../UI/Visualization2/AlertDisplay';
import BarGraph from '../UI/Visualization2/BarGraph';
import DataTable from '../UI/Visualization2/DataTable';
import GroupResult from '../UI/Visualization2/GroupResult';
import HeatMapChart from '../UI/Visualization2/HeatMapChart';
import LineGraph from '../UI/Visualization2/LineGraph';
import MeanPlot from '../UI/Visualization2/MeanPlot';
import { Result } from '../utils';
import RenderResult from './RenderResult';
import Cluster from '../UI/Visualization2/Cluster';

type Props = {
  result: ResultUnion;
  constraint?: boolean;
  allowExport?: boolean;
};

type Switcher = {
  [key: string]: (data?: ResultUnion, constraint?: boolean) => React.ReactNode;
};

const children = {
  tableresult: (data) => <DataTable data={data as TableResult} />,
  rawresult: (data, constraint) => (
    <ResultsErrorBoundary>
      <RenderResult
        results={[(data as RawResult)?.rawdata] as Result[]}
        constraint={constraint ?? true}
      />
    </ResultsErrorBoundary>
  ),
  heatmapresult: (data) => <HeatMapChart data={data as HeatMapResult} />,
  linechartresult: (data) => <LineGraph data={data as LineChartResult} />,
  meanchartresult: (data) => <MeanPlot data={data as MeanChartResult} />,
  barchartresult: (data) => <BarGraph data={data as BarChartResult} />,
  groupsresult: (data) => (
    <GroupResult result={data as GroupsResult} loading={false} />
  ),
  clusterresult: (data) => <Cluster data={data as ClusterResult} />,
  alertresult: (data) => <AlertDisplay data={data as AlertResult} />,
  error: () => <div> An error occured </div>,
} as Switcher;

const ResultDispatcher = ({
  result,
  constraint,
  allowExport = true,
}: Props) => {
  return (
    <ExportResult result={result} allowExport={allowExport}>
      {(data, type) => (
        <>{children[type] && children[type](data, constraint)}</>
      )}
    </ExportResult>
  );
};

export default ResultDispatcher;
