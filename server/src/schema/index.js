import { makeExecutableSchema } from 'graphql-tools';

import userSchema from './user';
import tweetSchema from './tweet';

import userResolvers from '../resolvers/user';
import tweetResolvers from '../resolvers/tweet';

const linkSchema = `
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [linkSchema, userSchema, tweetSchema],
  resolvers: [userResolvers, tweetResolvers],
});

export default schema;
