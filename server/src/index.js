import express from 'express';
import bodyParser from 'body-parser';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';

import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import models from './models';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

models.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Go to http://localhost:3000/graphiql for GraphiQL');
  });
});

