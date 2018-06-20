import axios from 'axios';

export const signIn = async (username, password) => {
  const {
    data: {
      data: {
        signIn: { token },
      },
    },
  } = await axios.post('http://localhost:8000/graphql', {
    query: `
      mutation {
        signIn(login: "rwieruch", password: "rwieruch") {
          token
        }
      }
    `,
  });

  return token;
};
