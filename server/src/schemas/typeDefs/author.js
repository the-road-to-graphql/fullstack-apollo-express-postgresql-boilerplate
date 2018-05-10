export default `
  extend type Query {
    authors: [Author!]!
    author(id: String!): Author!
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Author!

    updateAuthor(id: String!, username: String!): Author!
    deleteAuthor(id: String!): Boolean!
  }

  type Author {
    id: String!
    username: String!,
    tweets: [Tweet!]!
  }
`;
