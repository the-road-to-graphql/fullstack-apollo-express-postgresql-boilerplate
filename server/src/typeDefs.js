const typeDefs = `
  type Query {
    tweets: [Tweet!]!
    authors: [Author!]!

    author(id: String!): Author!
    tweet(id: String!): Tweet!
  }

  type Mutation {
    addTweet(authorId: String!, text: String!): Tweet!
  }

  type Tweet {
    id: String!
    authorId: String!
    author: Author!
    text: String!
  }

  type Author {
    id: String!
    username: String!,
    tweets: [Tweet!]!
  }
`;

export default typeDefs;
