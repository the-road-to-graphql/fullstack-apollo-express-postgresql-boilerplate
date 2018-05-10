import dotenv from 'dotenv';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';

import schema from './schemas';
import models, { sequelize } from './models';

dotenv.config();

const app = express();

app.use(cors());

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: { models, secret: process.env.SECRET },
  }),
);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

sequelize.sync({ force: true }).then(async () => {
  const createPromiseOne = models.Author.create(
    {
      username: 'rwieruch',
      email: 'robin@wieruch.com',
      password: 'robin@wieruch',
      tweets: [
        {
          text:
            'Published the next edition of the Road to learn React',
        },
        {
          text: 'A complete React with Apollo and GraphQL Tutorial',
        },
      ],
    },
    {
      include: [models.Tweet],
    },
  );

  const createPromiseTwo = models.Author.create(
    {
      username: 'ddavids',
      email: 'dave@davids.com',
      password: 'dave@davids',
      tweets: [
        {
          text: 'Happy to release a GraphQL in React tutorial',
        },
      ],
    },
    {
      include: [models.Tweet],
    },
  );

  Promise.all([createPromiseOne, createPromiseTwo]).then(() => {
    app.listen(8000, () => {
      console.log(
        'Go to http://localhost:8000/graphiql for GraphiQL',
      );
    });
  });
});
