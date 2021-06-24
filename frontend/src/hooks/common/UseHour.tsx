import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
interface Props {
  onSetStart: (time: string) => void;
  onSetEnd: (time: string) => void;
}

const times = [
  { label: '오전 01:00', value: 'a1' },
  { label: '오전 02:00', value: 'a2' },
  { label: '오전 03:00', value: 'a3' },
  { label: '오전 04:00', value: 'a4' },
  { label: '오전 05:00', value: 'a5' },
  { label: '오전 06:00', value: 'a6' },
  { label: '오전 07:00', value: 'a7' },
  { label: '오전 08:00', value: 'a8' },
  { label: '오전 09:00', value: 'a9' },
  { label: '오전 10:00', value: 'a10' },
  { label: '오전 11:00', value: 'a11' },
  { label: '오전 12:00', value: 'a12' },
  { label: '오후 01:00', value: 'p1' },
  { label: '오후 02:00', value: 'p2' },
  { label: '오후 03:00', value: 'p3' },
  { label: '오후 04:00', value: 'p4' },
  { label: '오후 05:00', value: 'p5' },
  { label: '오후 06:00', value: 'p6' },
  { label: '오후 07:00', value: 'p7' },
  { label: '오후 08:00', value: 'p8' },
  { label: '오후 09:00', value: 'p9' },
  { label: '오후 10:00', value: 'p10' },
  { label: '오후 11:00', value: 'p11' },
  { label: '오후 12:00', value: 'p12' },
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
    const time = e.value;
    onSetStart(time);
  };
  const setEndHour = (e: any) => {
    const time = e.value;
    onSetEnd(time);
  };
  return (
    <TimeBlock>
      <span>모임시간&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <TimeSelect>
        <Select
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 999,
            }),
          }}
          placeholder="선택"
          options={times}
          onChange={setStartHour}
        ></Select>
      </TimeSelect>
      <div>&nbsp;~&nbsp;</div>
      <TimeSelect>
        <Select
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 999,
            }),
          }}
          placeholder="선택"
          options={times}
          onChange={setEndHour}
        ></Select>
      </TimeSelect>
    </TimeBlock>
  );
};

export default UseHour;
