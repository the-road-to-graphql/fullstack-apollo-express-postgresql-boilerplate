import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import * as routes from '../../constants/routes';
import { GET_CURRENT_AUTHOR } from './queries';

const withAuthorization = conditionFn => Component => props => (
  <Query query={GET_CURRENT_AUTHOR}>
    {({ data }) =>
      conditionFn(data) ? (
        <Component {...props} />
      ) : (
        <Redirect to={routes.SIGN_IN} />
      )
    }
  </Query>
);

export default withAuthorization;
