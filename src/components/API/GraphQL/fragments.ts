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
      childHeaders {
        name
        names
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
