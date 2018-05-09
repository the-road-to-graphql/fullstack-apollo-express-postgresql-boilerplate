export default {
  Query: {
    authors: async (parent, args, { models }) =>
      await models.Author.findAll(),

    author: async (parent, { id }, { models }) =>
      await models.Author.findById(id),
  },

  Mutation: {
    createAuthor: async (parent, { username }, { models }) =>
      await models.Author.create({
        username,
      }),

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
