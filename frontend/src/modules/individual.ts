import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import lodash, { attempt } from 'lodash';
type initial = {
  PickWeek: any;
  PickTime: any;
  PickDays: any;
  startHour: number;
  endHour: number;
  month: any;
};

const initialState: initial = {
  PickWeek: [],
  PickTime: [],
  PickDays: [],
  startHour: 10,
  endHour: 20,
  month: 6,
};

export const individualSlice = createSlice({
  name: 'TIMETABLE',
  initialState,
  reducers: {
    cloneWeek: (state, action: PayloadAction<any>) => {
      state.PickWeek = lodash.cloneDeep(action.payload);
      state.PickWeek.unshift({ day: 0 });
    },
    cloneDays: (state, action: PayloadAction<any>) => {
      state.PickDays = lodash.cloneDeep(action.payload);
    },
    setStart: (state, action: PayloadAction<any>) => {
      state.startHour = action.payload;
    },
    setEnd: (state, action: PayloadAction<any>) => {
      state.endHour = action.payload;
    },
    addTimes: (state) => {
      const number = (state.endHour - state.startHour) * 2;
      for (let i = 0; i < 8; i++) {
        state.PickTime[i] = [];
      }
      if (state.PickTime) {
        for (let j = 0; j < 8; j++) {
          for (let i = state.startHour; i <= state.endHour; i += 0.5) {
            if (state.PickTime[j]) {
              if (j === 0) {
                if (i >= 12) {
                  if (i % 1 === 0) {
                    if (i === 12) {
                      state.PickTime[j].push({ time: `오후 12시 00분` });
                    } else
                      state.PickTime[j].push({ time: `오후 ${i - 12}시 00분` });
                  } else if (i === 12.5) {
                    state.PickTime[j].push({
                      time: `오후 12시 30분`,
                      hiddenText: true,
                    });
                  } else {
                    state.PickTime[j].push({
                      time: `오후 ${i - 12.5}시 30분`,
                      hiddenText: true,
                    });
                  }
                } else {
                  if (i % 1 === 0) {
                    state.PickTime[j].push({ time: `오전 ${i}시 00분` });
                  } else
                    state.PickTime[j].push({
                      time: `오전 ${i - 0.5}시 30분`,
                      hiddenText: true,
                    });
                }
              } else if (state.PickDays[state.month]) {
                if (state.PickDays[state.month]) {
                  let k = 0;
                  let h = 1;
                  for (k = 0; k < state.PickDays[state.month].length; k++) {
                    for (h = 1; h < 8; h++) {
                      if (state.PickWeek.length !== 1) {
                        const find =
                          state.PickWeek[h].day ===
                            state.PickDays[state.month][k].day &&
                          state.PickWeek[h].month === state.month;
                        if (find) {
                          for (
                            let l = state.startHour;
                            l <= state.endHour;
                            l += 0.5
                          ) {
                            if (state.PickTime[h].length - 1 !== number) {
                              state.PickTime[h].push({
                                time: l,
                                // day: state.PickWeek[l].day,
                                canSee: true,
                                isWeekend: true,
                              });
                            }
                          }
                          j += 1;
                          h += 1;
                          continue;
                        }
                      }
                    }
                  }
                }
              } else if (state.PickWeek[j]) {
                state.PickTime[j].push({
                  time: i,
                  day: state.PickWeek[j].day,
                  canSee: true,
                });
              }
            }
          }
        }
      }
    },
  },
});

export const {
  cloneWeek,
  addTimes,
  setStart,
  setEnd,
  cloneDays,
} = individualSlice.actions;

export default individualSlice.reducer;
