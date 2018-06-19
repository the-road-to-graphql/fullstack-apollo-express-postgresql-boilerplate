import { skip } from 'graphql-resolvers';

const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new Error('NOT_AUTHENTICATED');

export default isAuthenticated;
