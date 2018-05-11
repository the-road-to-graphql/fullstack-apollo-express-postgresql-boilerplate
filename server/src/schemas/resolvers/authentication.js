import { skip } from 'graphql-resolvers';

const isAuthenticated = (parent, args, { currentUser }) =>
  currentUser ? skip : new Error('Not authenticated.');

export default isAuthenticated;
