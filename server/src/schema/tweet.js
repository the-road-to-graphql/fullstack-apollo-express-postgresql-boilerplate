import { gql } from 'apollo-server-express';

export default gql`
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
    userId: String!
    user: User!
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
