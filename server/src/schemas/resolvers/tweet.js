import models from '../../models';

export default {
  Query: {
    tweets: async () => await models.Tweet.findAll(),

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

  Tweet: {
    author: async tweet =>
      await models.Author.find({
        where: {
          id: tweet.authorId,
        },
      }),
  },
};
