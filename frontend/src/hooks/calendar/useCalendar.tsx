import React, { useState, useCallback, useEffect } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import Button from '../../lib/styles/Button';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import 'dayjs/plugin/utc';
import { useSelector, useDispatch } from 'react-redux';
import {
  addDays,
  nextMonth,
  prevMonth,
  dragMonth,
  clickMonth,
  setDay,
  setInitialDate,
  addTitle,
} from '../../modules/calendar';
import { RootState } from '../../modules';

import CalendarPresent from './CalendarPresent';
import Modal, { useModal } from '../common/useModal';
import { red } from '@material-ui/core/colors';
import { executeReducerBuilderCallback } from '@reduxjs/toolkit/dist/mapBuilders';

interface Props {}

export function useCalendar() {
  const { Days, weekOfDay, month, title } = useSelector((state: RootState) => ({
    Days: state.calendar.Days,
    weekOfDay: state.calendar.weekOfDay,
    month: state.calendar.month,
    title: state.calendar.title,
  }));
  const [isDown, onChangeDown] = useState({
    drag: false,
    key: 99999,
  });

  const timezone = require('dayjs/plugin/timezone');
  const utc = require('dayjs/plugin/utc');
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDay(dayjs().tz('Asia/Seoul').locale('ko')));
    dispatch(addDays());
    return () => {
      dispatch(setInitialDate());
    };
  }, [dispatch]);
  const onClickPrev = () => {
    dispatch(prevMonth());
    dispatch(addDays());
  };
  const onClickNext = () => {
    dispatch(nextMonth());
    dispatch(addDays());
  };
  const onClickDrag = (id: number) => {
    dispatch(dragMonth(id));
  };
  const onClickMonth = (id: number) => {
    dispatch(clickMonth(id));
  };
  const onChangeTitle = (word: string) => {
    dispatch(addTitle(word));
  };
  return {
    onClickPrev,
    onClickNext,
    weekOfDay,
    Days,
    month,
    onClickDrag,
    isDown,
    onChangeDown,
    onClickMonth,
    onChangeTitle,

    title,
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
  height: 80%;
  padding: 1rem;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 5rem;
  h4 {
    width: 10%;
  }
  h5 {
    width: 5%;
  }
`;

const Title = styled.input`
  padding-top: 5rem;
  display: flex;
  width: 40%;
  font-size: 1.5rem;
  border: none;
  border-bottom: 1px solid black;
  padding-bottom: 1rem;

  outline: none;
  min-width: 17rem;
  height: 6rem;
  text-align: center;
  background-color: transparent;
  color: black;
  ::placeholder {
    padding-left: 0.5rem;
    color: #bbbbbb;
  }
  &:focus {
    ::placeholder {
      color: white;
    }
    color: black;
  }
  & + & {
    margin-top: 2.5rem;
  }
`;

const ButtonClick = styled(Button)`
  display: flex;
  height: 3rem;
  cursor: pointer;
  align-items: center;
  width: 10%;
  min-width: 4rem;
  justify-content: center;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  display: flex;

  margin-bottom: 1rem;

  width: 100%;
  justify-content: center;
  align-items: center;

  h3 {
    z-index: 999;
    box-sizing: border-box;

    font-weight: 600;
    font-size: 1.6rem;
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h2 {
    z-index: 1;
    display: flex;
    width: 10%;
    font-weight: 800;
    font-size: 1.5rem;
    align-content: center;
    justify-content: center;
    padding-left: 1rem;
  }
  h4 {
    width: 5%;
  }
`;

const Cal = styled.div`
  flex-grow: 1;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  box-sizing: border-box;
  text-align: center;
`;

const DayOfWeek = styled.div`
  font-size: 1.2rem;
  display: flex;
  font-weight: bolder;
  align-items: center;

  justify-content: center;
`;

export const Calendar = (props: Props) => {
  const {
    onClickNext,
    onClickPrev,
    weekOfDay,
    month,
    Days,
    onClickDrag,
    onClickMonth,
    isDown,
    onChangeDown,
    onChangeTitle,
    title,
  } = useCalendar();
  const { modal, onCancel, onConfirm, onNextClick } = useModal();
  return (
    <CalendarWrapper>
      <CalendarContainer>
        <TitleContainer>
          <h5 />
          <h4 />
          <h4 />
          <Title
            placeholder="모임명을 입력 하세요"
            onChange={(e) => {
              onChangeTitle(e.target.value);
            }}
          ></Title>
          <h4 />
          <h5 />
          <ButtonClick cyan onClick={onNextClick}>
            <div>생성</div>
          </ButtonClick>
        </TitleContainer>
        <Header>
          <h2 />
          <h4 />
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
          <h4></h4>
          <h2>{month.format('YYYY')}</h2>
        </Header>
        <Cal>
          {weekOfDay.map((week): any => (
            <DayOfWeek
              style={
                week === 'Sa'
                  ? { color: 'blue' }
                  : week === 'Su'
                  ? { color: 'red' }
                  : { color: 'black' }
              }
              key={week}
            >
              {week}
            </DayOfWeek>
          ))}
          {Days.map((day: any) => (
            <CalendarPresent
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
      <Modal visible={modal} onCancel={onCancel} onConfirm={onConfirm}></Modal>
    </CalendarWrapper>
  );
};
