import React from 'react';
import type { day } from './useCalendar';
import styled, { css } from 'styled-components';
interface Props {
  day: day;
  onSetEnd: (id: number) => void;
  onSetStart: (id: number) => void;
  onClickDrag: () => void;
}

const DayBox = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0.2rem;
  line-height: 2rem;
`;

function CalendarPresent({ day, onClickDrag, onSetEnd, onSetStart }: Props) {
  return (
    <DayBox
      onMouseDown={(e) => {
        e.preventDefault();
        onSetStart(day.key);
      }}
      onMouseUpCapture={() => {
        onSetEnd(day.key);
      }}
      onMouseUp={() => {
        onClickDrag();
      }}
      style={
        day.present
          ? { opacity: 1, cursor: 'pointer', backgroundColor: `${day.color}` }
          : { opacity: 0.3, cursor: 'not-allowed' }
      }
    >
      {day.day}
    </DayBox>
  );
}

export default CalendarPresent;
