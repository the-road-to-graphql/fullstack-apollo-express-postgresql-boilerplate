import models from './models';

const resolvers = {
  Query: {
    tweets: async () => await models.Tweet.findAll(),
    authors: async () => await models.Author.findAll(),

    author: async (_, { id }) =>
      await models.Author.find({
        where: {
          id,
        },
      }),

    tweet: async (_, { id }) =>
      await models.Tweet.find({
        where: {
          id,
        },
      }),
  },

  Mutation: {
    addTweet: async (_, { authorId, text }) =>
      await models.Tweet.create({
        text,
        authorId,
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

  Tweet: {
    author: async tweet =>
      await models.Author.find({
        where: {
          id: tweet.authorId,
        },
      }),
  },
};

export default resolvers;
