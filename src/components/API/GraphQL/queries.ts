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
      rootGroup {
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
      groups {
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
    }
  }
`;
