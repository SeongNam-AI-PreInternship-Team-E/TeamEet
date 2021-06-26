import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import lodash from 'lodash';
type initial = {
  PickWeek: any;
  PickTime: any;
  startHour: number;
  endHour: number;
};

const initialState: initial = {
  PickWeek: [0, 1, 2, 3, 4, 5, 6, 7],
  PickTime: [],
  startHour: 10,
  endHour: 20,
};

export const individualSlice = createSlice({
  name: 'TIMETABLE',
  initialState,
  reducers: {
    cloneDays: (state, action: PayloadAction<any>) => {
      // state.PickWeek = lodash.cloneDeep(action.payload);
    },
    addTimes: (state) => {
      for (let i = 0; i < 8; i++) {
        state.PickTime[i] = [];
      }
      if (state.PickTime) {
        for (let j = 0; j < 8; j++) {
          for (let i = state.startHour; i <= state.endHour; i += 0.25) {
            if (state.PickTime[j]) {
              state.PickTime[j].push({ time: i });
            }
          }
        }
      }
    },
  },
});

export const { cloneDays, addTimes } = individualSlice.actions;

export default individualSlice.reducer;
