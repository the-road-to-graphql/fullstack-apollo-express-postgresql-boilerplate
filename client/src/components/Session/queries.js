import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  {
    currentUser {
      id
      username
      email
      role
    }
  }
`;
