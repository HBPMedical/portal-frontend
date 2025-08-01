import { gql } from '@apollo/client';
import { coreInfoResult } from './fragments';

export const QUERY_CONFIGURATION = gql`
  query getConfiguration {
    configuration {
      connectorId
      hasGalaxy
      hasGrouping
      hasFilters
      hasGrouping
      enableSSO
      skipAuth
      skipTos
      version
    }
  }
`;

export const QUERY_LIST_ALGORITHMS = gql`
  query listAlgorithms {
    algorithms {
      id
      label
      type
      description
      variable {
        ...VarBody
      }
      coVariable {
        ...VarBody
      }
      hasFormula
      parameters {
        ...ParamBody
      }
      preprocessing {
        __typename
        name
        label
        hint
        parameters {
          ...ParamBody
        }
      }
    }
  }

  fragment ParamBody on BaseParameter {
    __typename
    name
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
        value
        label
      }
      linkedTo
    }
  }

  fragment VarBody on VariableParameter {
    hint
    isRequired
    hasMultiple
    allowedTypes
  }
`;

export const QUERY_FILTER_FORMULA = gql`
  query getFilterFormulaData {
    algorithms {
      id
      label
      hasFormula
    }
    filter {
      numberTypes
    }
    formula {
      variableType
      operationTypes
    }
  }
`;

export const QUERY_VARS_FROM_DOMAIN = gql`
  query getVariablesFromDomain {
    domains {
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
      longitudinal
      datasets {
        id
        label
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
        name
        parameters {
          name
          value
        }
        preprocessing {
          name
          parameters {
            name
            value
            values {
              name
              value
            }
          }
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
      longitudinal
      datasets {
        id
        label
      }
      variables {
        id
        label
        type
        description
        datasets
        enumerations {
          value
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
      refreshToken
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
