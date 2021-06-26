import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
interface Props {
  onSetStart: (time: number) => void;
  onSetEnd: (time: number) => void;
}

const times = [
  { label: '오전 01:00', value: '1' },
  { label: '오전 02:00', value: '2' },
  { label: '오전 03:00', value: '3' },
  { label: '오전 04:00', value: '4' },
  { label: '오전 05:00', value: '5' },
  { label: '오전 06:00', value: '6' },
  { label: '오전 07:00', value: '7' },
  { label: '오전 08:00', value: '8' },
  { label: '오전 09:00', value: '9' },
  { label: '오전 10:00', value: '10' },
  { label: '오전 11:00', value: '11' },
  { label: '오전 12:00', value: '12' },
  { label: '오후 01:00', value: '13' },
  { label: '오후 02:00', value: '14' },
  { label: '오후 03:00', value: '15' },
  { label: '오후 04:00', value: '16' },
  { label: '오후 05:00', value: '17' },
  { label: '오후 06:00', value: '18' },
  { label: '오후 07:00', value: '19' },
  { label: '오후 08:00', value: '20' },
  { label: '오후 09:00', value: '21' },
  { label: '오후 10:00', value: '22' },
  { label: '오후 11:00', value: '23' },
  { label: '오후 12:00', value: '24' },
];

const TimeBlock = styled.div`
  display: flex;

  line-height: 2rem;
  text-align: center;
  align-content: center;
  align-self: center;
  span {
    font-size: 0.8rem;
    display: flex;
    align-items: center;
  }
`;
const TimeSelect = styled.div`
  width: 35%;
`;

const UseHour = ({ onSetStart, onSetEnd }: Props) => {
  const setStartHour = (e: any) => {
    const time = Number(e.value);
    onSetStart(time);
  };
  const setEndHour = (e: any) => {
    const time = Number(e.value);
    onSetEnd(time);
  };
  return (
    <TimeBlock>
      <span>모임시간&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <TimeSelect>
        <Select
          placeholder="선택"
          options={times}
          onChange={setStartHour}
        ></Select>
      </TimeSelect>
      <div>&nbsp;~&nbsp;</div>
      <TimeSelect>
        <Select
          placeholder="선택"
          options={times}
          onChange={setEndHour}
        ></Select>
      </TimeSelect>
    </TimeBlock>
  );
};

export default UseHour;
