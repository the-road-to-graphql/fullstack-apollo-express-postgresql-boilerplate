import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import AccountPage from '../Account';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

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

class App extends Component {
  render() {
    return (
      <Query query={GET_CURRENT_AUTHOR}>
        {({ data, loading, error, refetch }) => (
          <Router history={history}>
            <div>
              <Navigation session={data} />

              <hr />

              <Route
                exact
                path={routes.LANDING}
                component={() => <LandingPage />}
              />
              <Route
                exact
                path={routes.SIGN_UP}
                component={() => <SignUpPage refetch={refetch} />}
              />
              <Route
                exact
                path={routes.SIGN_IN}
                component={() => <SignInPage refetch={refetch} />}
              />
              <Route
                exact
                path={routes.ACCOUNT}
                component={() => <AccountPage />}
              />
            </div>
          </Router>
        )}
      </Query>
    );
  }
}

export default App;
