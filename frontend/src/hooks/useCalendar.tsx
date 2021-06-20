import React, { useState, useCallback, useEffect } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import styled from 'styled-components';
import dayjs from 'dayjs';
import MyNewCal from './MyNewCal';
import 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import 'dayjs/plugin/utc';
import { start } from 'repl';
interface Props {}

export function useCalendar() {
  const timezone = require('dayjs/plugin/timezone');
  const utc = require('dayjs/plugin/utc');
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [month, onChangeMonth] = useState(
    dayjs().tz('Asia/Seoul').locale('ko')
  );

  const onClickPlus = useCallback(() => {
    onChangeMonth(month.add(1, 'M'));
  }, [month]);
  const onClickMinus = useCallback(() => {
    onChangeMonth(month.subtract(1, 'M'));
  }, [month]);
  const weekOfDay = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return { onClickPlus, onClickMinus, month, weekOfDay };
}

function getDays(month: any) {
  let days = [];
  let i = 1;
  let k = 0;
  const LastMonth = month.subtract(1, 'M');
  const LastMonthEndDay = LastMonth.endOf('M');

  const presentMonthStartDay = month.startOf('M').day();
  const preDate = month.endOf('M').date();

  let subDate = LastMonthEndDay.date();
  console.log(subDate);
  for (i = subDate - presentMonthStartDay + 1; i <= subDate; i++) {
    days.push({ day: i, present: false, key: k, color: 'white' });
    k++;
  }
  for (i = 1; i <= preDate; i++) {
    days.push({ day: i, present: true, key: k, color: 'white' });
    k++;
  }
  i = 1;
  while (days.length !== 42) {
    days.push({ day: i, present: false, key: k, color: 'white' });
    i++;
    k++;
  }

  return days;
}

export interface day {
  day: number;
  present: boolean;
  key: number;
  color: string;
}
const CalendarWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1.2rem;

  h2 {
    font-weight: 800;
    font-size: 1.5rem;
  }
  h3 {
    display: flex;
    flex-direction: row;
    font-weight: 600;
    font-size: 1.2rem;
  }
`;

const Cal = styled.div`
  flex-grow: 1;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  width: auto;
  height: auto;
  text-align: center;
  align-items: center;
  align-content: center;
`;

export const Calendar = (props: Props) => {
  const { onClickPlus, onClickMinus, month, weekOfDay } = useCalendar();

  const [days, onChangeDay] = useState(getDays(month));
  console.log(days);
  const onChangeColorStyle = (id: number) => {
    onChangeDay(
      days.map((day) => (day.key === id ? { ...day, color: '#5465FF' } : day))
    );
  };
  return (
    <CalendarWrapper>
      <CalendarContainer>
        <Header>
          <h2>{month.format('YYYY')}</h2>
          <h3>
            <AiFillCaretLeft
              onClick={() => {
                onClickMinus();
                onChangeDay(getDays(month.subtract(1, 'M')));
              }}
              style={{ cursor: 'pointer' }}
            ></AiFillCaretLeft>
            {month.locale('en').format('MMM')}
            &nbsp;
            {month.format('MM')}
            <AiFillCaretRight
              onClick={() => {
                onClickPlus();
                onChangeDay(getDays(month.add(1, 'M')));
              }}
              style={{ cursor: 'pointer' }}
            ></AiFillCaretRight>
          </h3>
        </Header>
        <Cal>
          {weekOfDay.map((week) => (
            <div key={week}>{week}</div>
          ))}
          {days.map((day) => (
            <MyNewCal
              key={day.key}
              onChangeColorStyle={onChangeColorStyle}
              day={day}
            ></MyNewCal>
          ))}
        </Cal>
      </CalendarContainer>
    </CalendarWrapper>
  );
};
