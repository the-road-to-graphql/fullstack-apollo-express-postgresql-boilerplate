import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import isAuthenticated from './authentication';
import { isMessageOwner } from './authorization';

import pubsub, { EVENTS } from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};

      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = messages.length > limit;
      const list = hasNextPage ? messages.slice(0, -1) : messages;

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

    message: async (parent, { id }, { models }) =>
      await models.Message.findById(id),
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, currentUser }) => {
        const message = await models.Message.create({
          text,
          userId: currentUser.id,
        });

        pubsub.publish(EVENTS.MESSAGE_CREATED, message);

        return message;
      },
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) =>
        await models.Message.destroy({ where: { id } }),
    ),
  },

  Message: {
    user: async (message, args, { userLoader }) =>
      await userLoader.load(message.userId),
  },

  Subscription: {
    messageCreated: {
      resolve: async (messageCreated, args, { models }) => {
        const message = messageCreated.get({ raw: true });
        const user = await models.User.findById(message.userId, {
          raw: true,
        });

        return {
          message: {
            ...message,
            user,
          },
        };
      },
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE_CREATED),
    },
  },
};
