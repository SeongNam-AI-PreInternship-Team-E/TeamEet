import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  startHour: 3,
  endHour: 17,
  days: [7, 8, 9],
  timeTable: [[], [], []],
};

export const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    changeStartHour: (state, action) => {
      state.startHour = action.payload;
    },
    changeEndHour: (state, action) => {
      state.endHour = action.payload;
    },
    addDays: (state) => {
      for (let i = 0; i < state.days.length; i++) {
        for (let j = state.startHour; j < state.endHour; j++) {
          state.timeTable[i].push({
            color: "white",
            select: false,
            time: j,
            day: i,
          });
        }
      }
    },
  },
});

export const { changeStartHour, changeEndHour, addDays } = timeSlice.actions;

export default timeSlice.reducer;
