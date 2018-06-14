import { combineResolvers, skip } from 'graphql-resolvers';

import isAuthenticated from './authentication';

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { currentUser: { role } }) =>
    role === 'admin' ? skip : new Error('NOT_AUTHORIZED_AS_ADMIN'),
);

export const isTweetOwner = async (
  parent,
  { id },
  { models, currentUser },
) => {
  const tweet = await models.Tweet.findById(id, { raw: true });

  if (tweet.userId !== currentUser.id) {
    throw new Error('NOT_AUTHORIZED_AS_OWNER');
  }

  return skip;
};
