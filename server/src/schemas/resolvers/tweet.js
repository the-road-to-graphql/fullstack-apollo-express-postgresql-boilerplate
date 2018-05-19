import { combineResolvers } from 'graphql-resolvers';

import isAuthenticated from './authentication';
import { isTweetOwner } from './authorization';

export default {
  Query: {
    tweets: async (
      parent,
      { order = 'DESC', offset, limit },
      { models },
    ) => {
      const tweets = await models.Tweet.findAll({
        order: [['createdAt', order]],
        offset,
        limit: limit + 1,
      });

      const hasNextPage = tweets.length > limit;
      const list = hasNextPage ? tweets.slice(0, -1) : tweets;

      return {
        list,
        pageInfo: {
          hasNextPage,
        },
      };
    },

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
      isTweetOwner,
      async (parent, { id }, { models }) =>
        await models.Tweet.destroy({ where: { id } }),
    ),
  },

  Tweet: {
    author: async (tweet, args, { models }) =>
      await models.Author.findById(tweet.authorId),
  },
};
