export default {
  Query: {
    tweets: async (parent, args, { models }) =>
      await models.Tweet.findAll(),

    tweet: async (parent, { id }, { models }) =>
      await models.Tweet.findById(id),
  },

  Mutation: {
    createTweet: async (parent, { text }, { models, currentUser }) =>
      await models.Tweet.create({
        text,
        authorId: currentUser.id,
      }),

    deleteTweet: async (parent, { id }, { models }) =>
      await models.Tweet.destroy({ where: { id } }),
  },

  Tweet: {
    author: async (tweet, args, { models }) =>
      await models.Author.findById(tweet.authorId),
  },
};
