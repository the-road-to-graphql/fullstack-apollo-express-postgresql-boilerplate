export default `
  extend type Query {
    authors: [Author!]!
    author(id: String!): Author!
  }

  type Author {
    id: String!
    username: String!,
    tweets: [Tweet!]!
  }
`;
