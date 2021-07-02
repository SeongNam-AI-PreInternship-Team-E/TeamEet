import client from './client';

export const getTime = (url: string) => {
  return client.get(`pages/${url}/register/`);
};
