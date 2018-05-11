import * as routes from '../../constants/routes';
import history from '../../constants/history';

const signOut = client => {
  localStorage.setItem('token', '');
  client.resetStore();
  history.push(routes.SIGN_IN);
};

export { signOut };
