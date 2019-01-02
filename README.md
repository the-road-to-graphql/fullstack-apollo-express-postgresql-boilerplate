# fullstack-apollo-express-postgresql-boilerplate

[![Build Status](https://travis-ci.org/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate.svg?branch=master)](https://travis-ci.org/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate) [![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/) [![Greenkeeper badge](https://badges.greenkeeper.io/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate.svg)](https://greenkeeper.io/)

A full-fledged Apollo Server with Apollo Client starter project with React and Express. [Read more about it in this tutorial to build it yourself](https://www.robinwieruch.de/graphql-apollo-server-tutorial/).

**Family of universal fullstack repositories:**

Server Applications:

* [Node.js with Express + MongoDB](https://github.com/the-road-to-graphql/fullstack-apollo-express-mongodb-boilerplate)
* [Node.js with Express + PostgreSQL](https://github.com/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate)

Client Applications:

* [React Client](https://github.com/the-road-to-graphql/fullstack-apollo-react-boilerplate)

## Features of Client + Server

* React (create-react-app) with Apollo Client
  * Queries, Mutations, Subscriptions
* Node.js with Express and Apollo Server
  * cursor-based Pagination
* PostgreSQL Database with Sequelize
  * entities: users, messages
* Authentication
  * powered by JWT and local storage
  * Sign Up, Sign In, Sign Out
* Authorization
  * protected endpoint (e.g. verify valid session)
  * protected resolvers (e.g. e.g. session-based, role-based)
  * protected routes (e.g. session-based, role-based)
* performance optimizations
  * example of using Facebook's dataloader
* E2E testing

## Installation

* `git clone git@github.com:the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate.git`
* `cd fullstack-apollo-express-postgresql-boilerplate`
* `touch .env`
* `npm install`
* fill out *.env file* (see below)
* start PostgreSQL database
* `npm start`
* visit `http://localhost:8000` for GraphQL playground

#### .env file

Since this boilerplate project is using PostgreSQL, you have to install it for your machine and get a database up and running. You find everything for the set up over here: [Setup PostgreSQL with Sequelize in Express Tutorial](https://www.robinwieruch.de/postgres-express-setup-tutorial). After you have created a database and a database user, you can fill out the environment variables in the *server/.env* file.

```
DATABASE=mydatabase

DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

SECRET=asdlplplfwfwefwekwself.2342.dawasdq
```

The `SECRET` is just a random string for your authentication. Keep all these information secure by adding the *.env* file to your *.gitignore* file. No third-party should have access to this information.

#### Testing

* adjust `test:run-server` npm script with `TEST_DATABASE` environment variable in package.json to match your testing database name
  * to match it from package.json: `createdb mytestdatabase` with psql
* one terminal: npm run test:run-server
* second terminal: test:execute-test

## Want to learn more about React + GraphQL + Apollo?

* Don't miss [upcoming Tutorials and Courses](https://www.getrevue.co/profile/rwieruch)
* Check out current [React Courses](https://roadtoreact.com)
