import Cookies from 'js-cookie';

export const setAuthToken = (token) => {
  const isProduction = window.location.protocol === 'https:';
  const domain = window.location.hostname;
  
  Cookies.set('jwt', token, {
    expires: 1,
    secure: true,
    sameSite: 'strict',
    domain: isProduction ? domain : undefined,
    path: '/'
  });
};

export const getAuthToken = () => {
  return Cookies.get('jwt');
};

export const removeAuthToken = () => {
  Cookies.remove('jwt');
};
