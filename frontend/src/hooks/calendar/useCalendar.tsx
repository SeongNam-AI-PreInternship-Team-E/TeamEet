import React, { useState, useCallback, useEffect } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  addDays,
  nextMonth,
  prevMonth,
  changeEndDay,
  changeStarDay,
  dragMonth,
  clickMonth,
} from '../../modules/calendar';
import { RootState } from '../../modules';

import CalendarPresent from './CalendarPresent';

interface Props {}

export function useCalendar() {
  const { Days, weekOfDay, month } = useSelector((state: RootState) => ({
    Days: state.calendar.Days,
    weekOfDay: state.calendar.weekOfDay,
    month: state.calendar.month,
  }));
  const [isDown, onChangeDown] = useState({
    drag: false,
    key: 99999,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addDays());
  }, [dispatch]);
  const onClickPrev = () => {
    dispatch(prevMonth());
    dispatch(addDays());
  };
  const onClickNext = () => {
    dispatch(nextMonth());
    dispatch(addDays());
  };
  const onSetStart = (id: number) => {
    dispatch(changeStarDay(id));
  };
  const onSetEnd = (id: number) => {
    dispatch(changeEndDay(id));
  };
  const onClickDrag = (id: number) => {
    dispatch(dragMonth(id));
  };
  const onClickMonth = (id: number) => {
    dispatch(clickMonth(id));
  };
  return {
    onClickPrev,
    onClickNext,
    weekOfDay,
    Days,
    month,
    onSetEnd,
    onSetStart,
    onClickDrag,
    isDown,
    onChangeDown,
    onClickMonth,
  };
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
`;

export const Calendar = (props: Props) => {
  const {
    onClickNext,
    onClickPrev,
    weekOfDay,
    month,
    Days,
    onSetEnd,
    onSetStart,
    onClickDrag,
    onClickMonth,
    isDown,
    onChangeDown,
  } = useCalendar();

  return (
    <CalendarWrapper>
      <CalendarContainer>
        <Header>
          <h2>{month.format('YYYY')}</h2>
          <h3>
            <AiFillCaretLeft
              onClick={() => {
                onClickPrev();
              }}
              style={{ cursor: 'pointer' }}
            ></AiFillCaretLeft>
            {month.locale('en').format('MMM')}
            &nbsp;
            {month.format('MM')}
            <AiFillCaretRight
              onClick={() => {
                onClickNext();
              }}
              style={{ cursor: 'pointer' }}
            ></AiFillCaretRight>
          </h3>
        </Header>
        <Cal>
          {weekOfDay.map((week) => (
            <div key={week}>{week}</div>
          ))}
          {Days.map((day: any) => (
            <CalendarPresent
              onSetEnd={onSetEnd}
              onSetStart={onSetStart}
              onClickDrag={onClickDrag}
              key={day.key}
              day={day}
              isDown={isDown}
              onChangeDown={onChangeDown}
              onClickMonth={onClickMonth}
            ></CalendarPresent>
          ))}
        </Cal>
      </CalendarContainer>
    </CalendarWrapper>
  );
};
