export default `
  extend type Query {
    tweets(cursor: String, limit: Int): TweetConnection!
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
    endCursor: String!
  }

  type Tweet {
    id: String!
    authorId: String!
    author: Author!
    text: String!
    createdAt: String!
  }

  extend type Subscription {
    tweetCreated: TweetCreated!
  }

  type TweetCreated {
    tweet: Tweet!
  }
`;
