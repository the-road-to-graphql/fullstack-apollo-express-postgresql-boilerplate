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
  context: ({ req, connection }) => {
    if (connection) {
      return {
        models,
        userLoader: new DataLoader(keys =>
          loaders.batchUsers(keys, models),
        ),
      };
    }

    if (req) {
      return {
        models,
        secret: process.env.SECRET,
        currentUser: req.currentUser,
        userLoader: new DataLoader(keys =>
          loaders.batchUsers(keys, models),
        ),
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

sequelize.sync({ force: true }).then(async () => {
  const promises = createUsersWithMessages(new Date());

  Promise.all([...promises]).then(() => {
    httpServer.listen({ port: 8000 }, () => {
      console.log('Apollo Server on http://localhost:8000/graphql');
    });
  });
});

const createUsersWithMessages = date => {
  const createPromiseOne = models.User.create(
    {
      id: '1',
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  const createPromiseTwo = models.User.create(
    {
      id: '2',
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
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
      include: [models.Message],
    },
  );

  return [createPromiseOne, createPromiseTwo];
};
