import { combineResolvers, skip } from 'graphql-resolvers';

import isAuthenticated from './authentication';

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { currentUser: { role } }) =>
    role === 'admin' ? skip : new Error('NOT_AUTHORIZED_AS_ADMIN'),
);

export const isMessageOwner = async (
  parent,
  { id },
  { models, currentUser },
) => {
  const message = await models.Message.findById(id, { raw: true });

  if (message.userId !== currentUser.id) {
    throw new Error('NOT_AUTHORIZED_AS_OWNER');
  }

  return skip;
};
