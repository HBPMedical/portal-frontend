import { gql } from '@apollo/client';

export const fragmentResults = gql`
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
