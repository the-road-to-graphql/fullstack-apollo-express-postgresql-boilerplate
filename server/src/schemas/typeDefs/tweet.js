export default `
  extend type Query {
    tweets: [Tweet!]!
    tweet(id: String!): Tweet!
  }

  extend type Mutation {
    addTweet(authorId: String!, text: String!): Tweet!
  }

  type Tweet {
    id: String!
    authorId: String!
    author: Author!
    text: String!
  }
`;
