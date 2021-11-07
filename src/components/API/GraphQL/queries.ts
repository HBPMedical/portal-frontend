import { gql } from '@apollo/client';
import { coreInfoResult } from './fragments';

export const QUERY_EXPERIMENT = gql`
  ${coreInfoResult}

  query getExperiment($uuid: String!) {
    expriment(uuid: $uuid) {
      ...testing
      author
      createdAt
      finishedAt
      viewed
      shared
      algorithm {
        name
        description
        label
        type
        parameters {
          name
          label
          value
        }
      }
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

export const QUERY_DOMAINS = gql`
  fragment coreGroupInfo on Group {
    id
    label
    description
    groups
    variables
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

export const ADD_TRANSIENT = gql`
  ${coreInfoResult}

  mutation createTransient($data: ExperimentCreateInput!) {
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

export const MUTATE_EXPERIMEMT = gql`
  mutation editExperiment($uuid: String!, $data: ExperimentEditInput!) {
    editExperiment(uuid: $uuid, data: $data) {
      uuid
      name
    }
  }
`;
