import React from 'react';
import { Query } from 'react-apollo';
import { GET_CURRENT_USER } from './queries';

const withSession = Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, refetch }) => (
      <Component {...props} session={data} refetch={refetch} />
    )}
  </Query>
);

export default withSession;
