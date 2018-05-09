import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';

import schema from './schemas';
import models, { sequelize } from './models';

const app = express();

app.use(cors());

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({ schema, context: { models } }),
);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

sequelize.sync({ force: true }).then(() => {
  const createPromiseOne = models.Author.create(
    {
      username: 'Robin Wieruch',
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
      username: 'Dave Davids',
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
