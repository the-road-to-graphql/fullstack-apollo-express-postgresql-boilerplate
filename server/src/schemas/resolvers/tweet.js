import models from '../../models';

export default {
  Query: {
    tweets: async () => await models.Tweet.findAll(),

    tweet: async (_, { id }) => await models.Tweet.findById(id),
  },

  Mutation: {
    createTweet: async (_, { authorId, text }) =>
      await models.Tweet.create({
        text,
        authorId,
      }),

    deleteTweet: async (_, { id }) =>
      await models.Tweet.destroy({ where: { id } }),
  },

  Tweet: {
    author: async tweet =>
      await models.Author.findById(tweet.authorId),
  },
};
