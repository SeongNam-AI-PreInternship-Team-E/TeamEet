import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import styled, { css } from 'styled-components';
import { TeamPresent } from './TeamPresent';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { cloneDates } from '../../modules/teamtime';

export const useIndividual = () => {
  const { PickWeek, PickTime, response } = useSelector((state: RootState) => ({
    PickWeek: state.teamtime.PickWeek,
    PickTime: state.teamtime.PickTime,
    response: state.teamtime.response,
  }));

  const dispatch = useDispatch();

  return { PickWeek, PickTime, response };
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

  grid-template-columns: repeat(8, 1fr);
  box-sizing: border-box;
  text-align: center;
`;

const DayOfWeek = styled.div<{ back_color: string }>`
  margin-top: 3rem;
  font-size: 1.2rem;
  font-weight: bolder;
  box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.25);
  /* :nth-child(1) {
    box-shadow: none;
    color: white;
  } */
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
export default function TeamTimeTable() {
  const { PickWeek, PickTime, response } = useIndividual();
  return (
    <TimeTableWrapper>
      <TimeTableContainer>
        <Time>
          {PickWeek.map((day: any) => (
            <DayOfWeek key={day.day} back_color={day.back_color}>
              {day.day}
            </DayOfWeek>
          ))}

          {PickTime[1] &&
            PickTime.map((time: any, index: number) => (
              <TeamPresent time={time} key={index}></TeamPresent>
            ))}
        </Time>
      </TimeTableContainer>
    </TimeTableWrapper>
  );
}
