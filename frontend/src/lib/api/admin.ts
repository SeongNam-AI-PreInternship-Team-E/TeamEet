import client from './client';
import type { Info } from '../../modules/calendar';
export const sendPage = (info: Info) => {
  const dayInfo = JSON.stringify({
    title: info.page.title,
    max_time: info.page.max_time,
    min_time: info.page.min_time,
    calendar_dates: info.solve,
  });
  console.log('data is ', info.solve);
  return client.post('/pages/', dayInfo);
};
