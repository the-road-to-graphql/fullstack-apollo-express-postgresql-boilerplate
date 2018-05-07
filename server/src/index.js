import express from 'express';
import bodyParser from 'body-parser';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';

import { makeExecutableSchema } from 'graphql-tools';

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

    author(id: String!): Author
    tweetsByAuthorId(id: String!): [Tweet]

    tweet(id: String!): Tweet
    authorByTweetId(id: String!): Author
  }

  type Mutation {
    addTweet(authorId: String!, text: String!): Tweet
  }

  type Tweet {
    id: String!
    author: Author
    text: String
  }

  type Author {
    id: String!
    username: String,
    tweets: [Tweet]
  }
`;

const resolvers = {
  Query: {
    tweets: () => tweets,
    authors: () => authors,

    author: (_, { id }) => authors.find(author => author.id === id),
    tweetsByAuthorId: (_, { id }) =>
      tweets.filter(tweet => tweet.authorId === id),

    tweet: (_, { id }) => tweets.find(tweet => tweet.id === id),
    authorByTweetId: (_, { id }) =>
      authors.find(author => author.tweets.includes(id)),
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

  Author: {
    tweets: author =>
      tweets.filter(tweet => tweet.authorId === author.id),
  },

  Tweet: {
    author: tweet =>
      authors.filter(author => author.tweetId === tweet.id),
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
