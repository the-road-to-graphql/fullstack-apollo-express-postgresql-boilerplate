const typeDefs = `
  type Query {
    tweets: [Tweet]
    authors: [Author]

    author(id: String!): Author
    tweetsByAuthorId(id: String!): [Tweet]

    tweet(id: String!): Tweet
    authorByTweetId(id: String!): Author
  }

  type Mutation {
    addTweet(authorId: String!, text: String!): Tweet
  }

  type Tweet {
    id: String!
    author: Author
    text: String
  }

  type Author {
    id: String!
    username: String,
    tweets: [Tweet]
  }
`;

export default typeDefs;
