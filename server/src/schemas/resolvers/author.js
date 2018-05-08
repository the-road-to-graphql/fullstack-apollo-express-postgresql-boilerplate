import models from '../../models';

export default {
  Query: {
    authors: async () => await models.Author.findAll(),

    author: async (_, { id }) =>
      await models.Author.find({
        where: {
          id,
        },
      }),
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
