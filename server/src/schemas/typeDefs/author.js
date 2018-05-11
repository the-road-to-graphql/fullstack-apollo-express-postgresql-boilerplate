export default `
  extend type Query {
    authors: [Author!]
    author(id: String!): Author
    currentAuthor: Author
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!
    signIn(login: String!, password: String!): Token!

    updateAuthor(username: String!): Author!
    deleteAuthor(id: String!): Boolean!
  }

  type Token {
    token: String!
  }

  type Author {
    id: String!
    username: String!
    email: String!
    role: String
    tweets: [Tweet!]!
  }
`;
