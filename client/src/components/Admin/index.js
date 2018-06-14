import React from 'react';

import withAuthorization from '../Session/withAuthorization';

const AdminPage = () => (
  <div>
    <h1>Admin Page</h1>
  </div>
);

export default withAuthorization(
  session =>
    session &&
    session.currentUser &&
    session.currentUser.role === 'ADMIN',
)(AdminPage);
