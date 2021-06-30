import client from './client';
import type { IdPw } from '../../modules/auth';

export const register = ({ id, pw }: IdPw) => {
  const user = JSON.stringify({ name: id, password: pw });
  return client.post('/pages/1-KSgrh/sign-in/', user);
};

export const login = ({ id, pw }: IdPw) => {
  const user = JSON.stringify({ name: id, password: pw });
  return client.post('/pages/1-KSgrh/users/', user);
};
