import { gql } from '@apollo/client';

export const QUERY_DOMAINS = gql`
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
      groups {
        id
        label
        level
        description
        groups {
          id
        }
        variables {
          id
        }
      }
    }
  }
`;
