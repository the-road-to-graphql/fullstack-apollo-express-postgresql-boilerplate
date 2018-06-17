import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import * as routes from '../../constants/routes';
import { GET_CURRENT_USER } from './queries';

const withAuthorization = conditionFn => Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, networkStatus }) => {
      if (networkStatus < 7) {
        return null;
      }

      return conditionFn(data) ? (
        <Component {...props} />
      ) : (
        <Redirect to={routes.SIGN_IN} />
      );
    }}
  </Query>
);

export default withAuthorization;
