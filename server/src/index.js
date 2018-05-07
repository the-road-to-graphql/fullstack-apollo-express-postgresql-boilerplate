const express = require('express');
const bodyParser = require('body-parser');

const {
  graphqlExpress,
  graphiqlExpress,
} = require('apollo-server-express');

const { makeExecutableSchema } = require('graphql-tools');

const tweets = [
  {
    text: 'Published the next edition of "the Road to learn React"',
    author: 'Robin Wieruch',
  },
  {
    text:
      'Releasing "a complete React with Apollo and GraphQL Tutorial" for building a GitHub client',
    author: 'Robin Wieruch',
  },
  {
    text:
      'Releasing a GraphQL in React tutorial which will end up in a ebook teaching about it about React with GraphQL',
    author: 'Robin Wieruch',
  },
];

const typeDefs = `
  type Query {
    tweets: [Tweet]
  }

  type Tweet {
    text: String
    author: String
  }
`;

const resolvers = {
  Query: {
    tweets: () => tweets,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql for GraphiQL');
});
