import { gql } from '@apollo/client';
import { coreInfoResult } from './fragments';

export const QUERY_CONFIGURATION = gql`
  query getConfiguration {
    configuration {
      connectorId
      hasGalaxy
      enableSSO
      skipAuth
      skipTos
      contactLink
      version
    }
  }
`;

export const QUERY_LIST_ALGORITHMS = gql`
  query listAlgorithms {
    algorithms {
      id
      label
      description
      variable {
        ...VarBody
      }
      coVariable {
        ...VarBody
      }
      parameters {
        id
        label
        hint
        isRequired
        hasMultiple
        defaultValue
        ... on NumberParameter {
          min
          max
          isReal
        }
        ... on NominalParameter {
          allowedValues {
            id
            label
          }
          linkedTo
        }
      }
    }
  }

  fragment VarBody on VariableParameter {
    hint
    isRequired
    hasMultiple
    allowedTypes
  }
`;

export const QUERY_MATOMO = gql`
  query getMatomo {
    configuration {
      matomo {
        enabled
        siteId
        urlBase
      }
    }
  }
`;

export const QUERY_VARS_FROM_DOMAIN = gql`
  query getVariablesFromDomain($id: String!) {
    domains(ids: [$id]) {
      variables {
        id
        label
        type
      }
    }
  }
`;

export const QUERY_ACTIVE_USER = gql`
  query activeUser {
    user {
      id
      username
      fullname
      email
      agreeNDA
    }
  }
`;

export const QUERY_DOMAIN_LIST = gql`
  query getDomainList {
    domains {
      id
      label
      datasets {
        id
        label
        isLongitudinal
      }
    }
  }
`;

export const QUERY_EXPERIMENT_LIST = gql`
  query getExperimentList($name: String = "", $page: Float = 0) {
    experimentList(name: $name, page: $page) {
      totalPages
      currentPage
      totalExperiments
      experiments {
        id
        name
        createdAt
        author {
          username
          fullname
        }
        viewed
        shared
        status
      }
    }
  }
`;

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
      filterVariables
      shared
      status
      formula {
        interactions
        transformations {
          id
          operation
        }
      }
      algorithm {
        id
        parameters {
          id
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
    datasets
  }

  query listDomains {
    domains {
      id
      label
      description
      datasets {
        id
        label
        isLongitudinal
      }
      variables {
        id
        label
        type
        description
        datasets
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

export const CREATE_EXPERIMENT = gql`
  ${coreInfoResult}

  mutation createExperiment(
    $data: ExperimentCreateInput!
    $isTransient: Boolean = true
  ) {
    createExperiment(data: $data, isTransient: $isTransient) {
      id @skip(if: $isTransient)
      name
      status
      results @include(if: $isTransient) {
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

export const MUTATE_LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const MUTATE_LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(variables: { username: $username, password: $password }) {
      accessToken
    }
  }
`;

export const MUTATE_ACTIVE_USER = gql`
  mutation updateActiveUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      username
      fullname
      email
      agreeNDA
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
