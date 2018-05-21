import dotenv from 'dotenv';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';

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

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

sequelize.sync({ force: false }).then(async () => {
  app.listen(8000, () => {
    console.log('Go to http://localhost:8000/graphiql for GraphiQL');
  });
});

// sequelize.sync({ force: true }).then(async () => {
//   const createPromiseOne = models.Author.create(
//     {
//       username: 'rwieruch',
//       email: 'robin@wieruch.com',
//       password: 'robin@wieruch',
//       role: 'ADMIN',
//       tweets: [
//         {
//           text:
//             'Published the next edition of the Road to learn React',
//         },
//         {
//           text: 'A complete React with Apollo and GraphQL Tutorial',
//         },
//       ],
//     },
//     {
//       include: [models.Tweet],
//     },
//   );

//   const createPromiseTwo = models.Author.create(
//     {
//       username: 'ddavids',
//       email: 'dave@davids.com',
//       password: 'dave@davids',
//       tweets: [
//         {
//           text: 'Happy to release a GraphQL in React tutorial',
//         },
//       ],
//     },
//     {
//       include: [models.Tweet],
//     },
//   );

//   Promise.all([createPromiseOne, createPromiseTwo]).then(() => {
//     app.listen(8000, () => {
//       console.log(
//         'Go to http://localhost:8000/graphiql for GraphiQL',
//       );
//     });
//   });
// });
