import { skip } from 'graphql-resolvers';

const isAuthenticated = (parent, args, { currentUser }) =>
  currentUser ? skip : new Error('NOT_AUTHENTICATED');

export default isAuthenticated;
