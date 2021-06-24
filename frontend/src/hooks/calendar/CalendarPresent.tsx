import React from 'react';
import type { Days } from '../../modules/calendar';
import styled, { css } from 'styled-components';
import { dragMonth } from '../../modules/calendar';
interface Props {
  day: Days;
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
  min-height: 3.5rem;
  line-height: 3.5rem;
`;

function CalendarPresent({
  day,
  onClickDrag,
  isDown,
  onChangeDown,
  onClickMonth,
}: Props) {
  return (
    <DayBox
      onMouseDown={(e) => {
        e.preventDefault();
        onChangeDown({ drag: true, key: day.key });
        onClickMonth(day.key);
      }}
      onMouseMove={() => {
        if (isDown.drag === true) {
          if (isDown.key !== day.key) onClickDrag(day.key);
          onChangeDown({ drag: true, key: day.key });
        }
      }}
      onMouseUp={() => {
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
