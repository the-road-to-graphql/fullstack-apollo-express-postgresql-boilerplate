import { expect } from 'chai';
import axios from 'axios';

import { signIn } from './util';

describe('users', () => {
  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '1',
            username: 'rwieruch',
            email: 'hello@robin.com',
            role: 'ADMIN',
          },
        },
      };

      const result = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            {
              user(id: "1") {
                id
                username
                email
                role
              }
            }
          `,
        },
      );

      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            {
              user(id: "42") {
                id
                username
                email
                role
              }
            }
          `,
        },
      );

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('users: [User!]', () => {
    it('returns a list of users', async () => {
      const expectedResult = {
        data: {
          users: [
            {
              id: '1',
              username: 'rwieruch',
              email: 'hello@robin.com',
              role: 'ADMIN',
            },
            {
              id: '2',
              username: 'ddavids',
              email: 'hello@david.com',
              role: null,
            },
          ],
        },
      };

      const result = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            {
              users {
                id
                username
                email
                role
              }
            }
          `,
        },
      );

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('me: User', () => {
    it('returns null when no user is signed in', async () => {
      const expectedResult = {
        data: {
          me: null,
        },
      };

      const result = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            {
              me {
                id
                username
                email
                role
              }
            }
          `,
        },
      );

      expect(result.data).to.eql(expectedResult);
    });

    it('returns me when me is signed in', async () => {
      const expectedResult = {
        data: {
          me: {
            id: '1',
            username: 'rwieruch',
            email: 'hello@robin.com',
            role: 'ADMIN',
          },
        },
      };

      const token = await signIn('rwieruch', 'rwieruch');

      const result = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            {
              me {
                id
                username
                email
                role
              }
            }
          `,
        },
        {
          headers: {
            'x-token': token,
          },
        },
      );

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('signUp, updateUser, deleteUser', () => {
    it('signs up a user, updates a user and deletes the user as admin', async () => {
      // sign up

      let {
        data: {
          data: {
            signUp: { token },
          },
        },
      } = await axios.post('http://localhost:8000/graphql', {
        query: `
            mutation(
              $username: String!,
              $email: String!,
              $password: String!
            ) {
              signUp(
                username: $username,
                email: $email,
                password: $password
              ) {
                token
              }
            }
          `,
        variables: {
          username: 'bar',
          email: 'foo@bar.com',
          password: 'asdasdasd',
        },
      });

      const {
        data: {
          data: { me },
        },
      } = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            {
              me {
                id
                email
                username
              }
            }
          `,
        },
        {
          headers: {
            'x-token': token,
          },
        },
      );

      expect(me).to.eql({
        id: '3',
        username: 'bar',
        email: 'foo@bar.com',
      });

      // update

      const {
        data: {
          data: { updateUser },
        },
      } = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            mutation ($username: String!) {
              updateUser(username: $username) {
                username
              }
            }
          `,
          variables: {
            username: 'foo',
          },
        },
        {
          headers: {
            'x-token': token,
          },
        },
      );

      expect(updateUser.username).to.eql('foo');

      // delete as admin

      token = await signIn('rwieruch', 'rwieruch');

      const {
        data: {
          data: { deleteUser },
        },
      } = await axios.post(
        'http://localhost:8000/graphql',
        {
          query: `
            mutation ($id: String!) {
              deleteUser(id: $id)
            }
          `,
          variables: {
            id: me.id,
          },
        },
        {
          headers: {
            'x-token': token,
          },
        },
      );

      expect(deleteUser).to.eql(true);
    });
  });
});

// { data: null,
//   errors:
//    [ { message: 'NOT_AUTHORIZED_AS_ADMIN',
//        locations: [],
//        path: [Array],
//        extensions: [Object] } ] }
