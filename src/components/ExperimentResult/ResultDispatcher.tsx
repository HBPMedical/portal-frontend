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
import ExportResult from '../UI/Export/ExportResult';

type Props = {
  result: ResultUnion;
  constraint?: boolean;
};

type Switcher = {
  [key: string]: (data?: ResultUnion) => React.ReactNode;
};

const ContainerResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ResultDispatcher = ({ result, constraint }: Props) => {
  const type: string = (result.__typename ?? 'error').toLowerCase();
  const children = ({
    tableresult: data => <DataTable data={data as TableResult} />,
    rawresult: data => (
      <ResultsErrorBoundary>
        <RenderResult
          results={[(data as RawResult)?.rawdata] as Result[]}
          constraint={constraint ?? true}
        />
      </ResultsErrorBoundary>
    ),
    heatmapresult: data => <HeatMapChart data={data as HeatMapResult} />,
    error: () => <div> An error occured </div>
  } as Switcher)[type];

  if (type === 'groupsresult')
    return <GroupTable result={result as GroupsResult} loading={false} />;

  if (!children) return <></>;

  return (
    <ExportResult result={result}>
      {data => (
        <ContainerResult
          className="exp-result"
          data-export={type === 'tableresult' ? 'container' : 'inplace'}
        >
          {children(data)}
        </ContainerResult>
      )}
    </ExportResult>
  );
};

export default ResultDispatcher;
