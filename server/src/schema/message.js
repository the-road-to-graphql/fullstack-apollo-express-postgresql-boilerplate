import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages(cursor: String, limit: Int): MessageConnection!
    message(id: String!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: String!): Boolean!
  }

  type MessageConnection {
    list: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Message {
    id: String!
    userId: String!
    user: User!
    text: String!
    createdAt: String!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`;
