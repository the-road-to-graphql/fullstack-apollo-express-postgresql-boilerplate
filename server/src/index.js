import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';

import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import * as loaders from './loaders';

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

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req: { currentUser } }) => ({
    models,
    secret: process.env.SECRET,
    currentUser,
    userLoader: new DataLoader(keys =>
      loaders.batchUsers(keys, models),
    ),
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

sequelize.sync({ force: true }).then(async () => {
  const promises = createUsersWithTweets(new Date());

  Promise.all([...promises]).then(() => {
    httpServer.listen({ port: 8000 }, () => {
      console.log('Apollo Server on http://localhost:8000/graphql');
    });
  });
});

const createUsersWithTweets = date => {
  const createPromiseOne = models.User.create(
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

  const createPromiseTwo = models.User.create(
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

  return [createPromiseOne, createPromiseTwo];
};
