import React, { useState, useCallback, useEffect } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import 'dayjs/plugin/utc';
import { daysSlice } from './../modules/calendar';
interface Props {}

export function useCalendar() {
  const timezone = require('dayjs/plugin/timezone');
  const utc = require('dayjs/plugin/utc');
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [month, onChangeMonth] = useState(dayjs().tz('Asia/Seoul').month() + 1);
  const year = dayjs().tz('Asia/Seoul').year();
  console.log(year);
  const onClickPlus = useCallback(() => {
    onChangeMonth(month + 1);
  }, [month]);
  const onClickMinus = useCallback(() => {
    onChangeMonth(month - 1);
  }, [month]);
  return { onClickPlus, onClickMinus, month };
}

const CalendarElement = styled.div`
  width: 100vw;
  height: 80vh;
  border: 1px solid black;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  flex-basis: 50px;
  background-color: rgb(224, 215, 202);
  display: flex;
  h2 {
    box-sizing: border-box;
    padding-left: 5px;
    flex-grow: 1;
    line-height: 50px;
  }
  h3 {
    flex-direction: row;
    box-sizing: border-box;
    padding-left: 5px;
    flex-grow: 4;
    line-height: 50px;
  }
  ul {
    line-height: 50px;
    flex-basis: 120px;
    padding-left: 0;
    padding-top: 4px;
    display: block;
    list-style-type: none;
    margin: 0;
    li {
      line-height: 50px;
      float: left;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
    }
  }
`;

const Cal = styled.div`
  flex-grow: 1;
  background-color: rgb(127, 184, 127);
  display: flex;
`;

export const Calendar = (props: Props) => {
  const { onClickPlus, onClickMinus, month } = useCalendar();
  return (
    <CalendarElement>
      <CalendarContainer>
        <Header>
          <h2>{dayjs().format('YYYY년 MM월')}</h2>
          <h3>{dayjs().format('현재 YYYY - MM - DD')}</h3>
          <h3>{month}</h3>
          <ul>
            <li>
              <AiFillCaretLeft
                onClick={onClickMinus}
                style={{ cursor: 'pointer' }}
              ></AiFillCaretLeft>
            </li>
            <li>이동</li>
            <li>
              <AiFillCaretRight
                onClick={onClickPlus}
                style={{ cursor: 'pointer' }}
              ></AiFillCaretRight>
            </li>
          </ul>
        </Header>

        <Cal />
      </CalendarContainer>
    </CalendarElement>
  );
};
