import { combineResolvers } from 'graphql-resolvers';

import isAuthenticated from './authentication';

export default {
  Query: {
    tweets: async (
      parent,
      { order = 'DESC', offset, limit },
      { models },
    ) =>
      await models.Tweet.findAll({
        order: [['createdAt', order]],
        offset,
        limit,
      }),

    tweet: async (parent, { id }, { models }) =>
      await models.Tweet.findById(id),
  },

  Mutation: {
    createTweet: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, currentUser }) =>
        await models.Tweet.create({
          text,
          authorId: currentUser.id,
        }),
    ),

    deleteTweet: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) =>
        await models.Tweet.destroy({ where: { id } }),
    ),
  },

  Tweet: {
    author: async (tweet, args, { models }) =>
      await models.Author.findById(tweet.authorId),
  },
};
