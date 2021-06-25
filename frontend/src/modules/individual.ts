import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import lodash from 'lodash';
type initial = {
  PickWeek: any;
  PickTime: any;
};

const initialState: initial = {
  PickWeek: [],
  PickTime: [],
};

export const individualSlice = createSlice({
  name: 'TIMETABLE',
  initialState,
  reducers: {
    cloneDays: (state, action: PayloadAction<any>) => {
      state.PickWeek = lodash.cloneDeep(action.payload);
    },
    addTimes: (state) => {
      for (let i = 0; i < 7; i++) {
        state.PickTime[i] = [];
      }
      if (state.PickTime) {
        for (let j = 0; j < 7; j++) {
          for (let i = 10; i <= 20; i += 0.5) {
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
