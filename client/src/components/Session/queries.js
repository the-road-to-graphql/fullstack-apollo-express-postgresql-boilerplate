import gql from 'graphql-tag';

export const GET_ME = gql`
  {
    me {
      id
      username
      email
      role
    }
  }
`;
