import axios from 'axios';

const API_URL = 'http://localhost:8000/graphql';

export const signInApi = async (login, password) =>
  await axios.post(API_URL, {
    query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
    variables: {
      login,
      password,
    },
  });

export const meApi = async token =>
  await axios.post(
    API_URL,
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

export const meApiWithoutToken = async () =>
  await axios.post(API_URL, {
    query: `
      {
        me {
          id
          email
          username
        }
      }
    `,
  });

export const userApi = async id =>
  axios.post(API_URL, {
    query: `
      query ($id: String!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
    variables: {
      id,
    },
  });

export const usersApi = async () =>
  axios.post(API_URL, {
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
  });

export const signUpApi = async (username, email, password) =>
  axios.post(API_URL, {
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
      username,
      email,
      password,
    },
  });

export const updateUserWithoutTokenApi = async username =>
  axios.post(API_URL, {
    query: `
      mutation ($username: String!) {
        updateUser(username: $username) {
          username
        }
      }
    `,
    variables: {
      username,
    },
  });

export const updateUserApi = async (token, username) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($username: String!) {
          updateUser(username: $username) {
            username
          }
        }
      `,
      variables: {
        username,
      },
    },
    {
      headers: {
        'x-token': token,
      },
    },
  );

export const deleteUserApi = async (token, id) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($id: String!) {
          deleteUser(id: $id)
        }
      `,
      variables: {
        id,
      },
    },
    {
      headers: {
        'x-token': token,
      },
    },
  );
