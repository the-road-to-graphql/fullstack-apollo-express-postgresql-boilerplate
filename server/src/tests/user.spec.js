import { expect } from 'chai';

import {
  signInApi,
  meApi,
  meApiWithoutToken,
  userApi,
  usersApi,
  signUpApi,
  updateUserApi,
  updateUserWithoutTokenApi,
  deleteUserApi,
} from './util';

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

      const result = await userApi('1');

      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await userApi('42');

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

      const result = await usersApi();

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

      const { data } = await meApiWithoutToken();

      expect(data).to.eql(expectedResult);
    });

    it('returns me when me is signed in', async () => {
      const expectedResult = {
        data: {
          me: {
            id: '1',
            username: 'rwieruch',
            email: 'hello@robin.com',
          },
        },
      };

      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signInApi('rwieruch', 'rwieruch');

      const { data } = await meApi(token);

      expect(data).to.eql(expectedResult);
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
      } = await signUpApi('bar', 'foo@bar.com', 'asdasdasd');

      const {
        data: {
          data: { me },
        },
      } = await meApi(token);

      expect(me).to.eql({
        id: '3',
        username: 'bar',
        email: 'foo@bar.com',
      });

      // update as user

      const {
        data: {
          data: { updateUser },
        },
      } = await updateUserApi(token, 'foo');

      expect(updateUser.username).to.eql('foo');

      // delete as admin

      const {
        data: {
          data: {
            signIn: { token: adminToken },
          },
        },
      } = await signInApi('rwieruch', 'rwieruch');

      const {
        data: {
          data: { deleteUser },
        },
      } = await deleteUserApi(adminToken, me.id);

      expect(deleteUser).to.eql(true);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('returns an error because only admins can delete a user', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signInApi('ddavids', 'ddavids');

      const {
        data: { errors },
      } = await deleteUserApi(token, '1');

      expect(errors[0].message).to.eql('NOT_AUTHORIZED_AS_ADMIN');
    });
  });

  describe('updateUser(username: String!): User!', () => {
    it('returns an error because only authenticated users can update a user', async () => {
      const {
        data: { errors },
      } = await updateUserWithoutTokenApi('foo');

      expect(errors[0].message).to.eql('NOT_AUTHENTICATED');
    });
  });

  describe('signIn(login: String!, password: String!): Token!', () => {
    it('returns a token when a user signs in with username', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signInApi('ddavids', 'ddavids');

      expect(token).to.be.a('string');
    });

    it('returns a token when a user signs in with email', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signInApi('hello@david.com', 'ddavids');

      expect(token).to.be.a('string');
    });

    it('returns an error when a user provides a wrong password', async () => {
      const {
        data: { errors },
      } = await signInApi('ddavids', 'foo');

      expect(errors[0].message).to.eql('Invalid password.');
    });
  });

  it('returns an error when a user is not found', async () => {
    const {
      data: { errors },
    } = await signInApi('foo', 'ddavids');

    expect(errors[0].message).to.eql(
      'No user found with this login credentials.',
    );
  });
});
