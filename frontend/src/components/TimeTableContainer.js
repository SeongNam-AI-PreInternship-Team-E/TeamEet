import { TimeTable } from '../hooks/time/useTime';
import Individual from '../hooks/time/useIndividual';
import TimeCalendar from './../hooks/time/useTimeCalendar';

export const TimeTableContainer = (props) => {
  return (
    <>
      <TimeCalendar />
      <Individual />
    </>
  );
};
