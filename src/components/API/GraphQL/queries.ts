import { gql } from '@apollo/client';

export const QUERY_DOMAINS = gql`
  fragment coreGroupInfo on Group {
    id
    label
    description
    groups {
      id
    }
    variables {
      id
    }
  }

  query listDomains {
    domains {
      id
      label
      description
      datasets {
        id
        label
      }
      variables {
        id
        label
        type
        description
        enumerations {
          id
          label
        }
      }
      rootGroup {
        ...coreGroupInfo
      }
      groups {
        ...coreGroupInfo
      }
    }
  }
`;

const ADD_TRANSIENT = gql`
  fragment coreInfoResult on ResultUnion {
    ... on TableResult {
      name
      data
      headers {
        name
        type
      }
    }
    ... on RawResult {
      rawdata
    }
  }

  mutation CreateTransient($data: ExperimentCreateInput!) {
    createExperiment(data: $data, isTransient: true) {
      name
      results {
        ... on GroupsResult {
          groups {
            name
            description
            results {
              ...coreInfoResult
            }
          }
        }
        ...coreInfoResult
      }
    }
  }
`;
