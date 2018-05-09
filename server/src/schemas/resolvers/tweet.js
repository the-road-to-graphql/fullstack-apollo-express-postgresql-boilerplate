export default {
  Query: {
    tweets: async (parent, args, { models }) =>
      await models.Tweet.findAll(),

    tweet: async (parent, { id }, { models }) =>
      await models.Tweet.findById(id),
  },

  Mutation: {
    createTweet: async (parent, { authorId, text }, { models }) =>
      await models.Tweet.create({
        text,
        authorId,
      }),

    deleteTweet: async (parent, { id }, { models }) =>
      await models.Tweet.destroy({ where: { id } }),
  },

  Tweet: {
    author: async (tweet, args, { models }) =>
      await models.Author.findById(tweet.authorId),
  },
};
