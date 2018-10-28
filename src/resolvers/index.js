import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from '../resolvers/user';
import messageResolvers from '../resolvers/message';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
];
