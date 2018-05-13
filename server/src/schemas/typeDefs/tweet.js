export default `
  extend type Query {
    tweets(order: String, offset: Int, limit: Int): TweetConnection!
    tweet(id: String!): Tweet!
  }

  extend type Mutation {
    createTweet(text: String!): Tweet!
    deleteTweet(id: String!): Boolean!
  }

  type TweetConnection {
    list: [Tweet!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
  }

  type Tweet {
    id: String!
    authorId: String!
    author: Author!
    text: String!
    createdAt: String!
  }
`;
