import { combineResolvers, skip } from 'graphql-resolvers';

import isAuthenticated from './authentication';

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { currentUser: { role } }) =>
    role === 'admin' ? skip : new Error('NOT_AUTHORIZED_AS_ADMIN'),
);
