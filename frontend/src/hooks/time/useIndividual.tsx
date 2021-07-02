import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import styled, { css } from 'styled-components';
import { InPresent } from './InPresent';
import { useDispatch } from 'react-redux';
import { clickIndividualTime, dragTimes } from '../../modules/individual';
import { useEffect } from 'react';
import { cloneDates } from '../../modules/teamtime';
import Button from '../../lib/styles/Button';

export const useIndividual = () => {
  const { PickWeek, PickTime, calendar_dates, id } = useSelector(
    (state: RootState) => ({
      PickWeek: state.individual.PickWeek,
      PickTime: state.individual.PickTime,
      calendar_dates: state.auth.calendar_dates,
      id: state.auth.id,
    })
  );
  const [isDown, onChangeDown] = useState({
    drag: false,
    key: 9999,
  });
  useEffect(() => {
    dispatch(cloneDates(calendar_dates));
  }, [calendar_dates]);
  const dispatch = useDispatch();
  const onClickDrag = (time: number, day: number) => {
    dispatch(dragTimes({ time, day }));
  };
  const onClickTime = (time: number, day: number) => {
    dispatch(clickIndividualTime({ time, day }));
  };
  return {
    PickWeek,
    PickTime,
    onClickDrag,
    isDown,
    onChangeDown,
    onClickTime,
    id,
  };
};

const TimeTableWrapper = styled.div`
  display: flex;
  width: 60%;
  height: 100%;
  padding: 1rem;
`;

const TimeTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Time = styled.div`
  display: grid;
  max-height: 30rem;
  grid-template-columns: repeat(8, 1fr);
  box-sizing: border-box;
  text-align: center;
`;

const DayOfWeek = styled.div<{ back_color: string }>`
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-weight: bolder;
  box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.25);
  :nth-child(1) {
    box-shadow: none;
    color: white;
  }
  :nth-child(2) {
    color: red;
  }
  :nth-child(8) {
    color: blue;
  }
  ${(props) =>
    props.back_color === '#98A2FF'
      ? css`
          background-color: ${props.back_color};
        `
      : css`
          opacity: 0.5;
        `}
`;
const Title = styled.div`
  display: flex;
  font-size: 2rem;
  h2 {
    justify-content: flex-start;
    font-size: 1rem;
    width: 50%;
    :nth-child(2) {
      justify-content: flex-end;
      justify-self: flex-end;
      text-align: end;
    }
  }
`;

export default function Individual() {
  const {
    PickWeek,
    PickTime,
    onClickDrag,
    isDown,
    onChangeDown,
    onClickTime,
    id,
  } = useIndividual();
  return (
    <TimeTableWrapper>
      <TimeTableContainer>
        <Title>
          <h2>Group Name : Team</h2>
          <h2>ID : {id}</h2>
        </Title>
        <Button to="/teamTable" middlewdith="true" cyan>
          등록하기
        </Button>
        <Time>
          {PickWeek.map((day: any) => (
            <DayOfWeek key={day.day} back_color={day.back_color}>
              {day.day}
            </DayOfWeek>
          ))}

          {PickTime.map((time: any, index: number) => (
            <InPresent
              isDown={isDown}
              onChangeDown={onChangeDown}
              onClickDrag={onClickDrag}
              time={time}
              key={index}
              onClickTime={onClickTime}
            ></InPresent>
          ))}
        </Time>
      </TimeTableContainer>
    </TimeTableWrapper>
  );
}
