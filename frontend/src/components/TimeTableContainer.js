import { TimeTable } from '../hooks/time/useTime';
import Individual from '../hooks/time/useIndividual';
import TimeCalendar from './../hooks/time/useTimeCalendar';

import { TimeTableTemplate } from '../hooks/time/useTimeTable';
export const TimeTableContainer = (props) => {
  return (
    <>
      <TimeTableTemplate>
        <TimeCalendar />
        <Individual />
      </TimeTableTemplate>
    </>
  );
};
