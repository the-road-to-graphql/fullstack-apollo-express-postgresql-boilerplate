const express = require('express');
const bodyParser = require('body-parser');

const {
  graphqlExpress,
  graphiqlExpress,
} = require('apollo-server-express');

const { makeExecutableSchema } = require('graphql-tools');

let idIterator = 3;
const generateId = () => {
  idIterator++;
  return idIterator;
};

const tweets = [
  {
    id: 't1',
    authorId: '1',
    text: 'Published the next edition of the Road to learn React',
  },
  {
    id: 't2',
    authorId: '1',
    text: 'A complete React with Apollo and GraphQL Tutorial',
  },
  {
    id: 't3',
    authorId: '2',
    text: 'Happy to release a GraphQL in React tutorial',
  },
];

const authors = [
  {
    id: '1',
    tweets: ['t1', 't2'],
    username: 'Robin Wieruch',
  },
  {
    id: '2',
    tweets: ['t3'],
    username: 'Dave Davids',
  },
];

const typeDefs = `
  type Query {
    tweets: [Tweet]
    authors: [Author]
    getAuthorById(id: String!): Author
    getTweetsByAuthorId(id: String!): [Tweet]
  }

  type Mutation {
    addTweet(authorId: String!, text: String!): Tweet
  }

  type Tweet {
    id: String!
    authorId: String
    text: String
  }

  type Author {
    id: String!
    username: String,
    tweets: [String]
  }
`;

const resolvers = {
  Query: {
    tweets: () => tweets,
    authors: () => authors,
    getAuthorById: (_, { id }) =>
      authors.find(author => author.id === id),
    getTweetsByAuthorId: (_, { id }) =>
      tweets.filter(tweet => tweet.authorId === id),
  },

  Mutation: {
    addTweet: (_, { authorId, text }) => {
      const id = `t${generateId()}`;
      const tweet = { id, text, authorId };

      tweets.push(tweet);
      authors.find(author => author.id === authorId).tweets.push(id);

      return tweet;
    },
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
