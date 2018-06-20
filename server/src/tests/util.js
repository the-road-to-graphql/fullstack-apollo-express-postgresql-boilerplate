import axios from 'axios';

export const signInApi = async (login, password) =>
  await axios.post('http://localhost:8000/graphql', {
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

export const meApiWithoutToken = async () =>
  await axios.post('http://localhost:8000/graphql', {
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
  axios.post('http://localhost:8000/graphql', {
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
  axios.post('http://localhost:8000/graphql', {
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
  axios.post('http://localhost:8000/graphql', {
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
  axios.post('http://localhost:8000/graphql', {
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
    'http://localhost:8000/graphql',
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
