import Cookies from 'js-cookie';

export const setAuthToken = (token) => {
  Cookies.set('jwt', token, { expires: 1, secure: true, sameSite: 'strict' });
};

export const getAuthToken = () => {
  return Cookies.get('jwt');
};

export const removeAuthToken = () => {
  Cookies.remove('jwt');
};
