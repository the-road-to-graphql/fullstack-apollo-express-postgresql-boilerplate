import gql from 'graphql-tag';

export const GET_CURRENT_AUTHOR = gql`
  {
    currentAuthor {
      id
      username
      email
      role
    }
  }
`;
