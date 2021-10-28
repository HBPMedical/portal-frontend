import * as Types from './types.generated';

import { gql } from '@apollo/client';
export type CoreInfoResult_GroupsResult_Fragment = { __typename?: 'GroupsResult' };

export type CoreInfoResult_HeatMapResult_Fragment = { __typename?: 'HeatMapResult', name: string, matrix: Array<Array<number>>, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string>, categories?: Types.Maybe<Array<string>> }> };

export type CoreInfoResult_LineChartResult_Fragment = { __typename?: 'LineChartResult', name: string, xAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, yAxis?: Types.Maybe<{ __typename?: 'ChartAxis', label?: Types.Maybe<string> }>, lines: Array<{ __typename?: 'LineResult', label: string, x: Array<number>, y: Array<number>, type?: Types.Maybe<Types.LineType>, extraLineInfos?: Types.Maybe<Array<{ __typename?: 'ExtraLineInfo', label: string, values: Array<string> }>> }> };

export type CoreInfoResult_RawResult_Fragment = { __typename?: 'RawResult', rawdata: any };

export type CoreInfoResult_TableResult_Fragment = { __typename?: 'TableResult', name: string, data: Array<Array<string>>, headers: Array<{ __typename?: 'Header', name: string, type: string }> };

export type CoreInfoResultFragment = CoreInfoResult_GroupsResult_Fragment | CoreInfoResult_HeatMapResult_Fragment | CoreInfoResult_LineChartResult_Fragment | CoreInfoResult_RawResult_Fragment | CoreInfoResult_TableResult_Fragment;

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
  }
  ... on LineChartResult {
    name
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