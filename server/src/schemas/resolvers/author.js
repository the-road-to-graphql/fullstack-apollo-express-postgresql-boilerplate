import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';

import isAuthenticated from './authentication';
import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, secret, { expiresIn });
};

export default {
  Query: {
    authors: async (parent, args, { models }) =>
      await models.Author.findAll(),

    author: async (parent, { id }, { models }) =>
      await models.Author.findById(id),

    currentAuthor: async (parent, args, { models, currentUser }) => {
      if (!currentUser) {
        return null;
      }

      return await models.Author.findById(currentUser.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.Author.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '30m') };
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.Author.findByLogin(login);

      if (!user) {
        throw new Error('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new Error('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },

    updateAuthor: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, currentUser }) => {
        const author = await models.Author.findById(currentUser.id);
        return await author.update({ username });
      },
    ),

    deleteAuthor: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) =>
        await models.Author.destroy({
          where: { id },
        }),
    ),
  },

  Author: {
    tweets: async (author, args, { models }) =>
      await models.Tweet.findAll({
        where: {
          authorId: author.id,
        },
      }),
  },
};
