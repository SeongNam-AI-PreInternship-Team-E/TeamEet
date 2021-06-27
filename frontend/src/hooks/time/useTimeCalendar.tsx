import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import Button from '../../lib/styles/Button';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import styled, { css } from 'styled-components';
import TeamCalendarPresent from './TeamCalendarPresent';
import { useEffect } from 'react';
import {
  addUseMonth,
  changeWeekColor,
  nextWeek,
  prevWeek,
  clickWeek,
} from '../../modules/timetable';
import { addNormalTime, addTimes, cloneWeek } from '../../modules/individual';

function useTimeCalendar() {
  const { teamMonth, month, weekOfDay, PickWeek, canPickWeek } = useSelector(
    (state: RootState) => ({
      teamMonth: state.timetable.teamMonth,
      month: state.timetable.month,
      weekOfDay: state.calendar.weekOfDay,
      PickWeek: state.timetable.PickWeek,
      canPickWeek: state.timetable.canPickWeek,
    })
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addUseMonth());
    console.log(PickWeek);
    PickWeek.length === 0 && dispatch(clickWeek(1));

    dispatch(cloneWeek(PickWeek));
    dispatch(addTimes());
    dispatch(addNormalTime());
    // dispatch(clickWeek(presentWeek));
  }, [dispatch, PickWeek]);
  useEffect(() => {
    dispatch(changeWeekColor());
  }, [dispatch]);
  const onClickNextWeek = () => {
    dispatch(nextWeek());
    dispatch(changeWeekColor());
  };
  const onClickPrevWeek = () => {
    dispatch(prevWeek());
    dispatch(changeWeekColor());
  };
  const onChangeWeek = (week: number) => {
    dispatch(clickWeek(week));
    dispatch(changeWeekColor());
    dispatch(cloneWeek(PickWeek));
    dispatch(addTimes());
    dispatch(addNormalTime());
  };

  return {
    teamMonth,
    month,
    weekOfDay,
    onClickNextWeek,
    onClickPrevWeek,
    onChangeWeek,
    canPickWeek,
  };
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

  margin-bottom: 1rem;
  padding-bottom: 1rem;
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

const DayOfWeek = styled.div`
  font-size: 1.2rem;
  font-weight: bolder;
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
      border: 0.5rem solid black;
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
      border-width: 10px 0px;
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

export default function TimeCalendar() {
  const {
    teamMonth,
    month,
    weekOfDay,
    onClickNextWeek,
    onClickPrevWeek,
    onChangeWeek,
    canPickWeek,
  } = useTimeCalendar();
  return (
    <CalendarWrapper>
      <CalendarContainer>
        {/* <TitleContainer>
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
    </TitleContainer> */}
        <Header>
          <AiFillCaretLeft
            onClick={onClickPrevWeek}
            style={{ cursor: 'pointer' }}
          ></AiFillCaretLeft>
          {/* {month.locale('en').format('MMM')} */}
          &nbsp;
          {/* {month.format('MM')} */}
          <AiFillCaretRight
            onClick={onClickNextWeek}
            style={{ cursor: 'pointer' }}
          ></AiFillCaretRight>
          {/* <h2>{month.format('YYYY')}</h2> */}
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
          {teamMonth[month.month() + 1].map((day: any) => (
            <DayBox
              onClick={() => {
                canPickWeek[day.week] && onChangeWeek(day.week);
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
