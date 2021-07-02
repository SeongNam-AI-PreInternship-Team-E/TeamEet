import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import Button from '../../lib/styles/Button';

import styled, { css } from 'styled-components';
import TeamCalendarPresent from './TeamCalendarPresent';
import { useEffect, useState } from 'react';
import qs from 'qs';

import {
  addTeamMonth,
  addUseDay,
  clickWeek,
  cloneStartEnd,
  getTeamInfo,
  addTimes,
  pushData,
  changeColor,
} from '../../modules/teamtime';
import { changeWeekColor } from '../../modules/teamtime';

function useTimeCalendar() {
  const {
    weekOfDay,
    month,
    teamMonth,
    canPickWeek,
    url,
    start_time,
    end_time,
    response,
  } = useSelector((state: RootState) => ({
    weekOfDay: state.calendar.weekOfDay,
    month: state.teamtime.month,
    teamMonth: state.teamtime.teamMonth,
    canPickWeek: state.teamtime.canPickWeek,
    url: state.teamtime.url,
    start_time: state.auth.start_time,
    end_time: state.auth.end_time,
    response: state.teamtime.response,
  }));
  const dispatch = useDispatch();
  // const [useMonth, onChangeUseMonth] = useState(canPickMonth[0].month);
  useEffect(() => {
    dispatch(addTeamMonth());
    dispatch(addUseDay());
    dispatch(getTeamInfo(url));
    dispatch(cloneStartEnd({ start_time, end_time }));
  }, [dispatch, url, start_time, end_time]);
  useEffect(() => {
    dispatch(clickWeek(1));
    dispatch(addTimes());
    dispatch(pushData());
    dispatch(changeColor(response));
  }, [dispatch, response]);
  const onChangeWeek = (week: number) => {
    // if (calendar_dates) {
    //   dispatch(
    //     submitTimeInfo({
    //       url: url,
    //       calendar_dates: calendar_dates,
    //       Authorization: Authorization,
    //     })
    //   );
    // }
  };
  const onClickWeek = (week: number) => {
    dispatch(changeWeekColor(week));
    dispatch(clickWeek(week));
    dispatch(addTimes());
    dispatch(pushData());
    dispatch(changeColor(response));
  };
  return { weekOfDay, month, teamMonth, onClickWeek, canPickWeek };
}

const CalendarWrapper = styled.div`
  display: flex;
  width: 40%;
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

  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
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
  &:nth-child(10) {
    border: 1px solid red;
  }
  :nth-last-child() {
    background-color: blue;
  }
  &:nth-child(1) {
    border: 1px solid red;
  }
`;

const Month = styled.div<{ select: boolean }>`
  cursor: pointer;
  min-width: 1rem;
  min-height: 1rem;
  margin-left: 1rem;
  padding: 1rem;
  margin-right: 1rem;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  ${(props) =>
    props.select
      ? css`
          background-color: #5465ff;
        `
      : css`
          opacity: 0.5;
        `}
`;

const DayOfWeek = styled.div`
  font-size: 1.2rem;
  display: flex;
  font-weight: bolder;
  align-items: center;
  justify-content: center;
`;

const DayBox = styled.div<{
  opacity: string;
  text_color: string;
  week: any;
  select: boolean;
  canPickWeek: boolean;
}>`
  cursor: pointer;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.2rem;
  min-height: 3rem;
  line-height: 3rem;
  cursor: pointer;

  background-color: ${(props) => props.color};
  color: ${(props) => props.text_color};
  opacity: ${(props) => props.opacity};

  box-sizing: border-box;
  ${(props) =>
    props.select &&
    css`
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
      border-width: 10px 0px;
      opacity: 1;
      box-sizing: border-box;
    `}
  ${(props) =>
    props.canPickWeek
      ? css`
          cursor: pointer;
        `
      : css`
          cursor: default;
        `}
`;

export default function TeamTimeCal() {
  const { teamMonth, month, weekOfDay, onClickWeek, canPickWeek } =
    useTimeCalendar();
  return (
    <CalendarWrapper>
      <CalendarContainer>
        <Header>
          {month.locale('en').format('MMM')}
          &nbsp;
          {month.format('MM')}
          {/* {canPickMonth.map((month: any) => (
            <Month
              select={month.select}
              onClick={() => {
                onClickWeek(month.month);
              }}
              style={{ cursor: 'pointer' }}
              key={month.month}
            >
              {month.month}
            </Month>
          ))} */}
        </Header>
        <Cal>
          {weekOfDay &&
            weekOfDay.map((week: any) => (
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
          {teamMonth[month.month() + 1] &&
            teamMonth[month.month() + 1].map((day: any) => (
              <DayBox
                onClick={() => {
                  canPickWeek[day.week] && onClickWeek(day.week);
                }}
                canPickWeek={canPickWeek[day.week]}
                key={day.key}
                color={day.color}
                text_color={day.text_color}
                opacity={day.opacity}
                week={day.week}
                select={day.select}
              >
                {day.day}
              </DayBox>
            ))}
        </Cal>
      </CalendarContainer>
    </CalendarWrapper>
  );
}
