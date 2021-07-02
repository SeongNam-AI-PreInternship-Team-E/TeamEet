import { TimeTable } from '../hooks/time/useTime';
import Individual from '../hooks/time/useIndividual';
import TeamTimeCal from '../hooks/teamTime/useTeamTimeCal';
import { TimeTableTemplate } from '../hooks/time/useTimeTable';
import TeamTimeTable from '../hooks/teamTime/useTeamTimeTable';
export const TeamTableContainer = () => {
  return (
    <>
      <TimeTableTemplate>
        <TeamTimeCal />
        <TeamTimeTable />
      </TimeTableTemplate>
    </>
  );
};
