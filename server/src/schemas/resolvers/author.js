import models from '../../models';

export default {
  Query: {
    authors: async () => await models.Author.findAll(),

    author: async (_, { id }) => await models.Author.findById(id),
  },

  Mutation: {
    createAuthor: async (_, { username }) =>
      await models.Author.create({
        username,
      }),

    updateAuthor: async (_, { id, username }) => {
      const author = await models.Author.findById(id);
      return await author.update({ username });
    },

    deleteAuthor: async (_, { id }) =>
      await models.Author.destroy({ where: { id } }),
  },

  Author: {
    tweets: async author =>
      await models.Tweet.findAll({
        where: {
          authorId: author.id,
        },
      }),
  },
};
