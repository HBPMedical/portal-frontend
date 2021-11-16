import { gql } from '@apollo/client';
import { coreInfoResult } from './fragments';

export const QUERY_EXPERIMENT = gql`
  ${coreInfoResult}

  query getExperiment($id: String!) {
    experiment(id: $id) {
      name
      id
      domain
      datasets
      author {
        username
        fullname
      }
      filter
      createdAt
      finishedAt
      viewed
      variables
      coVariables
      shared
      status
      algorithm {
        id
        description
        label
        type
        parameters {
          id
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
  mutation editExperiment($id: String!, $data: ExperimentEditInput!) {
    editExperiment(id: $id, data: $data) {
      id
      name
      viewed
      shared
      status
      updateAt
    }
  }
`;

export const DELETE_EXPERIMEMT = gql`
  mutation deleteExperiment($id: String!) {
    removeExperiment(id: $id) {
      id
      status
    }
  }
`;
