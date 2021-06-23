import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addDays } from "../../modules/time";

export function useTime() {
  const { timeTable, days } = useSelector((state) => ({
    timeTable: state.time.timeTable,
    days: state.time.days,
  }));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addDays());
  }, [dispatch]);

  return {
    timeTable,
    days,
  };
}
//1. 함수 받아와서 생성

//2. styledComponent
const TimeTableStyle = styled.div`
  .container {
    display: flex;
  }
  .bye {
    display: flex;
  }
  .dayitem {
    width: 500px;
    height: 500px;
    background-color: black;
  }
  .day {
    display: flex;
    flex-direction: column;

    border: 1px solid black;
    background: #f2f2f2;
  }
`;

const DayStyle = styled.div`
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: repeat(3, 1fr);
`;

//3. 화면단만 구성
export const TimeTable = () => {
  const { timeTable, days } = useTime();

  return (
    <TimeTableStyle>
      <div className="hi">
        <div className="bye">
          {days.map((da) => (
            <div className="dayitem" key={da}>
              {da}
            </div>
          ))}
        </div>
        <div className="container">
          {timeTable.map((day) => (
            <div className="day">
              {day.map((time) => (
                <div className="item" key={time.time}>
                  {time.day} {time.time}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </TimeTableStyle>
  );
};
