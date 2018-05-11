export default `
  extend type Query {
    tweets: [Tweet!]!
    tweet(id: String!): Tweet!
  }

  extend type Mutation {
    createTweet(text: String!): Tweet!
    deleteTweet(id: String!): Boolean!
  }

  type Tweet {
    id: String!
    authorId: String!
    author: Author!
    text: String!
    createdAt: String!
  }
`;
