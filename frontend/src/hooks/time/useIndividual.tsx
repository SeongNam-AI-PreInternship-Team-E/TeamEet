import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import styled from 'styled-components';
import { InPresent } from './InPresent';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTimes } from '../../modules/individual';
export const useIndividual = () => {
  const { PickWeek, PickTime } = useSelector((state: RootState) => ({
    PickWeek: state.individual.PickWeek,
    PickTime: state.individual.PickTime,
  }));
  const dispatch = useDispatch();
  useEffect(() => {});
  // useEffect(() => {
  //   dispatch(cloneDays(PickWeek));
  // }, [dispatch, PickWeek]);
  return { PickWeek, PickTime };
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

const DayOfWeek = styled.div`
  margin-top: 3rem;
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
`;
export default function Individual() {
  const { PickWeek, PickTime } = useIndividual();
  return (
    <TimeTableWrapper>
      <TimeTableContainer>
        <Time>
          {PickWeek.map((day: any) => (
            <DayOfWeek key={day.day}>{day.day}</DayOfWeek>
          ))}

          {PickTime.map((time: any) => (
            <InPresent time={time}></InPresent>
          ))}
        </Time>
      </TimeTableContainer>
    </TimeTableWrapper>
  );
}