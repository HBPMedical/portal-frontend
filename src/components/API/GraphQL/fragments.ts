import { gql } from '@apollo/client';

export const coreInfoResult = gql`
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
    ... on BarChartResult {
      name
      xAxis {
        label
      }
      yAxis {
        label
      }
      barValues
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
