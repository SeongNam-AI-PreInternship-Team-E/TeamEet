import React from 'react';
import type { Times } from '../../modules/timetable';
import styled, { css } from 'styled-components';
import { dragMonth } from '../../modules/calendar';
interface Props {
  day: Times;
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

function CalendarPresent({ day }: Props) {
  return (
    <DayBox
      style={
        day.present
          ? {
              opacity: `${day.opacity}`,

              backgroundColor: `${day.color}`,
              color: `${day.text_color}`,
            }
          : {
              opacity: `${day.opacity}`,

              backgroundColor: `${day.color}`,
              color: `${day.text_color}`,
            }
      }
    >
      {day.day}
    </DayBox>
  );
}

export default CalendarPresent;
