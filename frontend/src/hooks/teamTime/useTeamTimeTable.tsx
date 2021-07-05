import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import styled, { css } from 'styled-components';
import { TeamPresent } from './TeamPresent';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { cloneDates } from '../../modules/teamtime';
import Button from '../../lib/styles/Button';
import CopyToClipboard from './ClipboardCopy';
import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';
export const useIndividual = () => {
  const { PickWeek, PickTime, response, url2, id } = useSelector(
    (state: RootState) => ({
      PickWeek: state.teamtime.PickWeek,
      PickTime: state.teamtime.PickTime,
      response: state.teamtime.response,
      url2: state.auth.url2,
      id: state.auth.id,
    })
  );
  const textInput = useRef(`http://www.himyteamnew.ml/#/register/${url2}`);

  const url = window.location.href;
  const dispatch = useDispatch();

  return { PickWeek, PickTime, response, url2, textInput, id };
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
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-weight: bolder;
  box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.25);
  opacity: 1;
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
          opacity: 1;
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
export default function TeamTimeTable() {
  const { PickWeek, PickTime, response, url2, textInput, id } = useIndividual();
  const k = String(textInput.current);

  console.log(k);
  return (
    <TimeTableWrapper>
      <TimeTableContainer>
        <Title>
          <h2>Group Name : Team</h2>
          <h2>ID : {id}</h2>
        </Title>
        {/* <CopyToClipboard text={k}>
          <button>Copy URL to the clipboard</button>
        </CopyToClipboard> */}
        <CopyToClipboard k={k}></CopyToClipboard>

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
