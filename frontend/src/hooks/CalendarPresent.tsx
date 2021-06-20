import React from 'react';
import type { day } from './useCalendar';
import styled from 'styled-components';
interface Props {
  onChangeColorStyle: (id: number) => void;
  day: day;
}

const DayElement = styled.div`
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
`;
const DayBox = styled.div`
  cursor: pointer;
  justify-self: center;
  box-sizing: border-box;
  min-width: 2rem;
  min-height: 2rem;
  border-radius: 50%;
  margin: 0.2rem;

  line-height: 2rem;
`;

function CalendarPresent({ onChangeColorStyle, day }: Props) {
  return (
    <DayBox onClick={() => onChangeColorStyle(day.key)}>
      <DayBox
        style={
          day.present
            ? { opacity: 1, backgroundColor: day.color }
            : { opacity: 0.3 }
        }
      >
        {day.day}
      </DayBox>
    </DayBox>
  );
}

export default CalendarPresent;
