import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import isAuthenticated from './authentication';
import { isTweetOwner } from './authorization';

import pubsub, { EVENTS } from '../../subscription';

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
          authorId: currentUser.id,
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
    author: async (tweet, args, { models }) =>
      await models.Author.findById(tweet.authorId),
  },

  Subscription: {
    tweetCreated: {
      resolve: async (tweetCreated, args, { models }) => {
        const tweet = tweetCreated.get({ raw: true });
        const author = await models.Author.findById(tweet.authorId, {
          raw: true,
        });

        return {
          tweet: {
            ...tweet,
            author,
          },
        };
      },
      subscribe: () => pubsub.asyncIterator(EVENTS.TWEET_CREATED),
    },
  },
};
