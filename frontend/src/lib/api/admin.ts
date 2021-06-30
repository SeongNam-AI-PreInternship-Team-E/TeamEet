import client from './client';

export const sendPage = ({ title, min_time, max_time }: any) => {
  const info = JSON.stringify({
    title: title,
    min_time: min_time,
    max_time: max_time,
  });
  return client.post('/pages/', info);
};

export const sendDates = ({ year, month, day, day_of_week }: any) => {
  const dayInfo = JSON.stringify({
    year: year,
    month: month,
    day: day,
    day_of_week: day_of_week,
  });
  return client.post('/dates/', dayInfo);
};
