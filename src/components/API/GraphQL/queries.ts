import { gql } from '@apollo/client';
import { fragmentResults } from './fragments';

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

const ADD_TRANSIENT = gql`
  ${fragmentResults}

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

const QUERY_EXPERIMENT = gql`
  ${fragmentResults}

  query experiment($uuid: String!) {
    expriment(uuid: $uuid) {
      name
      uuid
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
        ...coreInfoResult
      }
    }
  }
`;

const MUTATE_EXPERIMEMT = gql`
  mutation experiment($uuid: String!, $data: ExperimentEditInput!) {
    editExperiment(uuid: $uuid, data: $data) {
      uuid
      name
    }
  }
`;
