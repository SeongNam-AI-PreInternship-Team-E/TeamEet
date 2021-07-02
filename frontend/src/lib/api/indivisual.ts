import client from './client';
import type { individual } from '../../modules/individual';
export const sendTime = ({
  url,
  calendar_dates,
  Authorization,
}: individual) => {
  const headers = {
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Authorization: `${Authorization}`,
    Accept: '*/*',
  };
  const dates = JSON.stringify({
    calendar_dates: calendar_dates,
  });
  return client.post(`/pages/${url}/register/`, dates, { headers });
};
