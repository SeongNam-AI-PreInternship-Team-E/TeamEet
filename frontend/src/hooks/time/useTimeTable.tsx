import styled from 'styled-components';

const TimeTableBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

export function TimeTableTemplate({ children }: any) {
  return <TimeTableBlock>{children}</TimeTableBlock>;
}
