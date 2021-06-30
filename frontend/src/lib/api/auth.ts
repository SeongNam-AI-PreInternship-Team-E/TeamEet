import client from './client';
import type { IdPw } from '../../modules/auth';

export const register = ({ id, pw, url }: IdPw) => {
  const user = JSON.stringify({ name: id, password: pw });
  return client.post(`/pages/${url}/users/`, user);
};

export const login = ({ id, pw, url }: IdPw) => {
  const user = JSON.stringify({ name: id, password: pw });
  return client.post(`/pages/${url}/sign-in/`, user);
};
