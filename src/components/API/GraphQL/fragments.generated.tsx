import * as Types from './types.generated';

import { gql } from '@apollo/client';
export type CoreInfoResult_AlertResult_Fragment = { __typename?: 'AlertResult', title?: Types.Maybe<string>, message: string, level?: Types.Maybe<Types.AlertLevel> };

export type CoreInfoResult_BarChartResult_Fragment = { __typename?: 'BarChartResult', name: string, barValues?: Types.Maybe<Array<number>>, hasConnectedBars?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, barEnumValues?: Types.Maybe<Array<{ __typename?: 'BarEnumValues', label: string, values: Array<number> }>> };

export type CoreInfoResult_GroupsResult_Fragment = { __typename?: 'GroupsResult' };

export type CoreInfoResult_HeatMapResult_Fragment = { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, heatMapStyle?: Types.Maybe<Types.HeatMapStyle>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> };

export type CoreInfoResult_LineChartResult_Fragment = { __typename?: 'LineChartResult', name: string, hasBisector?: Types.Maybe<boolean>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> };

export type CoreInfoResult_MeanChartResult_Fragment = { __typename?: 'MeanChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, pointCIs: Array<{ __typename?: 'PointCI', min?: Types.Maybe<number>, mean: number, max?: Types.Maybe<number> }> };

export type CoreInfoResult_RawResult_Fragment = { __typename?: 'RawResult', rawdata?: Types.Maybe<any> };

export type CoreInfoResult_TableResult_Fragment = { __typename?: 'TableResult', name: string, data: Array<Array<string>>, tableStyle?: Types.Maybe<Types.TableStyle>, headers: Array<{ __typename?: 'Header', name: string, type: string }> };

export type CoreInfoResultFragment = CoreInfoResult_AlertResult_Fragment | CoreInfoResult_BarChartResult_Fragment | CoreInfoResult_GroupsResult_Fragment | CoreInfoResult_HeatMapResult_Fragment | CoreInfoResult_LineChartResult_Fragment | CoreInfoResult_MeanChartResult_Fragment | CoreInfoResult_RawResult_Fragment | CoreInfoResult_TableResult_Fragment;

export const CoreInfoResultFragmentDoc = gql`
    fragment coreInfoResult on ResultUnion {
  ... on RawResult {
    rawdata
  }
  ... on TableResult {
    name
    data
    headers {
      name
      type
    }
    tableStyle
  }
  ... on MeanChartResult {
    name
    xAxis {
      label
      categories
    }
    yAxis {
      label
      categories
    }
    pointCIs {
      min
      mean
      max
    }
  }
  ... on HeatMapResult {
    name
    matrix
    xAxis {
      label
      categories
    }
    yAxis {
      label
      categories
    }
    heatMapStyle
  }
  ... on AlertResult {
    title
    message
    level
  }
  ... on BarChartResult {
    name
    xAxis {
      label
      categories
    }
    yAxis {
      label
    }
    barValues
    barEnumValues {
      label
      values
    }
    hasConnectedBars
  }
  ... on LineChartResult {
    name
    hasBisector
    xAxis {
      label
    }
    yAxis {
      label
    }
    lines {
      label
      x
      y
      extraLineInfos {
        label
        values
      }
      type
    }
  }
}
    `;
export const namedOperations = {
  Fragment: {
    coreInfoResult: 'coreInfoResult'
  }
}