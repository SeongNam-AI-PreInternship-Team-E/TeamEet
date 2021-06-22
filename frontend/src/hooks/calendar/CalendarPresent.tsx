import React from 'react';
import type { Days } from '../../modules/calendar';
import styled, { css } from 'styled-components';
import { dragMonth } from '../../modules/calendar';
interface Props {
  day: Days;
  onSetEnd: (id: number) => void;
  onSetStart: (id: number) => void;
  onClickDrag: (id: number) => void;
  isDown: any;
  onChangeDown: any;
  onClickMonth: (id: number) => void;
}

const DayBox = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0.2rem;
  line-height: 2rem;
`;

function CalendarPresent({
  day,
  onClickDrag,
  onSetEnd,
  onSetStart,
  isDown,
  onChangeDown,
  onClickMonth,
}: Props) {
  return (
    <DayBox
      onMouseDown={(e) => {
        e.preventDefault();
        onSetStart(day.key);
        onChangeDown({ drag: true, key: day.key });
        onClickMonth(day.key);
      }}
      onMouseMove={() => {
        if (isDown.drag === true) {
          onSetEnd(day.key);
          if (isDown.key !== day.key) onClickDrag(day.key);
          onChangeDown({ drag: true, key: day.key });
          // dragMonth(day.key);
        }
      }}
      onMouseUpCapture={() => {
        onSetEnd(day.key);
      }}
      onMouseUp={() => {
        // onClickDrag();
        onChangeDown(false);
      }}
      style={
        day.present
          ? {
              opacity: 1,
              cursor: 'pointer',
              backgroundColor: `${day.color}`,
              color: `${day.text_color}`,
            }
          : { opacity: 0.3, cursor: 'not-allowed' }
      }
    >
      {day.day}
    </DayBox>
  );
}

export default CalendarPresent;
