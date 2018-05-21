import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import isAuthenticated from './authentication';
import { isTweetOwner } from './authorization';

export default {
  Query: {
    tweets: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: cursor,
              },
            },
          }
        : {};

      const tweets = await models.Tweet.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
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
