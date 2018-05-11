import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_CURRENT_AUTHOR = gql`
  {
    currentAuthor {
      id
      username
      email
      role
    }
  }
`;

const withSession = Component => () => (
  <Query query={GET_CURRENT_AUTHOR}>
    {({ data, refetch }) => (
      <Component session={data} refetch={refetch} />
    )}
  </Query>
);

export default withSession;
