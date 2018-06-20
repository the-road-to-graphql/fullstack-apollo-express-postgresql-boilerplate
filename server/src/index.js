import http from 'http';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import { ApolloServer } from 'apollo-server-express';

import './env';
import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import * as loaders from './loaders';

const app = express();

app.use(cors());

app.use(async (req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      const me = await jwt.verify(token, process.env.SECRET);
      req.me = me;
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
        me: req.me,
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

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  createUsersWithMessages(new Date());

  httpServer.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async date => {
  await models.User.create(
    {
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

  await models.User.create(
    {
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
};
