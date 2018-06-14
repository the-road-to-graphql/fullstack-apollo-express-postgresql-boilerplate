import dotenv from 'dotenv';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';

import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import schema from './schemas';
import models, { sequelize } from './models';

dotenv.config();

const app = express();

app.use(cors());

app.use(async (req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (e) {
      const error = 'Your session expired. Sign in again.';
      res.status(401).json({ error });
    }
  }

  next();
});

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async ({ currentUser }) => ({
    schema,
    context: {
      models,
      secret: process.env.SECRET,
      currentUser,
    },
  })),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:8000/subscriptions`,
  }),
);

const server = createServer(app);

sequelize.sync({ force: true }).then(async () => {
  const date = new Date();

  const createPromiseOne = models.Author.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      tweets: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
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
      email: 'hello@david.com',
      password: 'ddavids',
      tweets: [
        {
          text: 'Happy to release a GraphQL in React tutorial',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'A complete React with Apollo and GraphQL Tutorial',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Tweet],
    },
  );

  Promise.all([createPromiseOne, createPromiseTwo]).then(() => {
    server.listen(8000, () => {
      console.log(
        `Apollo Server is now running on http://localhost:8000`,
      );

      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema,
          onOperation: (message, params, webSocket) => {
            return { ...params, context: { models } };
          },
        },
        {
          server,
          path: '/subscriptions',
        },
      );
    });
  });
});
