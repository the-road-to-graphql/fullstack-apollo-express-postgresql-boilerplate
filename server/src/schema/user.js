import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: String!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
    ): Token!
    signIn(login: String!, password: String!): Token!

    updateUser(username: String!): User!
    deleteUser(id: String!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: String!
    username: String!
    email: String!
    role: String
    messages: [Message!]
  }
`;
