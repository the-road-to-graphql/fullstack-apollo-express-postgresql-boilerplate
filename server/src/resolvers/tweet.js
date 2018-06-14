import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import isAuthenticated from './authentication';
import { isTweetOwner } from './authorization';

import pubsub, { EVENTS } from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    tweets: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
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
          endCursor: toCursorHash(
            list[list.length - 1].createdAt.toString(),
          ),
        },
      };
    },

    tweet: async (parent, { id }, { models }) =>
      await models.Tweet.findById(id),
  },

  Mutation: {
    createTweet: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, currentUser }) => {
        const tweet = await models.Tweet.create({
          text,
          userId: currentUser.id,
        });

        pubsub.publish(EVENTS.TWEET_CREATED, tweet);

        return tweet;
      },
    ),

    deleteTweet: combineResolvers(
      isAuthenticated,
      isTweetOwner,
      async (parent, { id }, { models }) =>
        await models.Tweet.destroy({ where: { id } }),
    ),
  },

  Tweet: {
    user: async (tweet, args, { userLoader }) =>
      await userLoader.load(tweet.userId),
  },

  Subscription: {
    tweetCreated: {
      resolve: async (tweetCreated, args, { models }) => {
        const tweet = tweetCreated.get({ raw: true });
        const user = await models.User.findById(tweet.userId, {
          raw: true,
        });

        return {
          tweet: {
            ...tweet,
            user,
          },
        };
      },
      subscribe: () => pubsub.asyncIterator(EVENTS.TWEET_CREATED),
    },
  },
};
