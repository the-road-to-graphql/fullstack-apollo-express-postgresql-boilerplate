import jwt from 'jsonwebtoken';

const createToken = async (user, secret, expiresIn) => {
  const { id, email } = user;
  return await jwt.sign({ id, email }, secret, { expiresIn });
};

export default {
  Query: {
    authors: async (parent, args, { models }) =>
      await models.Author.findAll(),

    author: async (parent, { id }, { models }) =>
      await models.Author.findById(id),
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models },
    ) => {
      return await models.Author.create({
        username,
        email,
        password,
      });
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

    updateAuthor: async (parent, { id, username }, { models }) => {
      const author = await models.Author.findById(id);
      return await author.update({ username });
    },

    deleteAuthor: async (parent, { id }, { models }) =>
      await models.Author.destroy({ where: { id } }),
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
