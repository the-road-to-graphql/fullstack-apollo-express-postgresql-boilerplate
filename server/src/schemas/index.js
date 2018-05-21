import { makeExecutableSchema } from 'graphql-tools';

import authorTypeDefs from './typeDefs/author';
import tweetTypeDefs from './typeDefs/tweet';

import authorResolvers from './resolvers/author';
import tweetResolvers from './resolvers/tweet';

const linkTypeDefs = `
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
  typeDefs: [linkTypeDefs, authorTypeDefs, tweetTypeDefs],
  resolvers: [authorResolvers, tweetResolvers],
});

export default schema;
