import styled from "styled-components";

const TimeTableBlock = styled.div`
  display: flex;
  flex-direction: row;
  width: 90rem;
  justify-content: center;
  margin: auto;

  /* 1040px이하 요소 세로 배치 */
  @media (max-width: 1040px) {
    flex-direction: column;
  }
`;

export function TimeTableTemplate({ children }: any) {
  return <TimeTableBlock>{children}</TimeTableBlock>;
}
