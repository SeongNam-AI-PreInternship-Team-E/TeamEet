import React, { useState, useCallback, useEffect } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import styled from 'styled-components';
import dayjs from 'dayjs';
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
  const weekOfDay = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return { onClickPlus, onClickMinus, month, weekOfDay };
}

function getDays(month: any) {
  let days: number[] = [];
  const LastMonth = month.subtract(1, 'M');
  const LastMonthEndDay = LastMonth.format('M');
  const LastMonthStartDay = LastMonth.startOf('M').month();

  const nextMonth = month.add(1, 'M');
  const nextMonthEndDay = nextMonth.format('M');
  const nextMonthStartDay = nextMonth.startOf('M').month();

  console.log('시작 요일', LastMonthStartDay);
  console.log('끝 요일', LastMonthEndDay);
  console.log('시작 요일', nextMonthStartDay);
  console.log('끝 요일', nextMonthStartDay);
}

const CalendarWrapper = styled.div`
  width: 50%;
  height: 30rem;
  border: 1px solid black;
  margin-left: 2rem;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
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
  background-color: #5465ff;
  display: grid;
  grid-template-columns: repeat(7, minmax(2rem, auto));
  grid-template-rows: repeat(6, 1fr);
  text-align: center;
  align-items: center;
`;

export const Calendar = (props: Props) => {
  const { onClickPlus, onClickMinus, month, weekOfDay } = useCalendar();
  getDays(month);
  return (
    <CalendarWrapper>
      <CalendarContainer>
        <Header>
          <h2>{month.format('YYYY')}</h2>
          <h3>
            {month.locale('en').format('MMM')}
            <AiFillCaretLeft
              onClick={onClickMinus}
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
            ></AiFillCaretLeft>
            {month.format('MM')}
            <AiFillCaretRight
              onClick={onClickPlus}
              style={{ cursor: 'pointer' }}
            ></AiFillCaretRight>
          </h3>
        </Header>
        <Cal>
          {weekOfDay.map((week) => (
            <div key={week}>{week}</div>
          ))}
        </Cal>
      </CalendarContainer>
    </CalendarWrapper>
  );
};
