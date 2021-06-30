import client from './client';

export const sendTime = (info: any) => {
  const dates = JSON.stringify({
    year: info.year,
    month: info.month,
    day: info.day,
    time: info.time,
  });
  return client.post(`/pages/${info.url}/register/`, dates);
};
