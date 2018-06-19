import React, { Fragment } from 'react';

import withSession from '../Session/withSession';

import { MessageCreate, Messages } from '../Message';

const Landing = ({ session }) => (
  <Fragment>
    <h2>Feed</h2>

    {session && session.me && <MessageCreate />}
    <Messages me={session.me} limit={2} />
  </Fragment>
);

export default withSession(Landing);
