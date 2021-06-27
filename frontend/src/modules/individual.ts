import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import lodash, { attempt } from 'lodash';
import { isWhiteSpaceLike } from 'typescript';
type initial = {
  PickWeek: any;
  PickTime: any;
  PickDays: any;
  startHour: number;
  endHour: number;
  IndividualTime: any;
  month: any;
  presentWeek: number;
  canPickWeek: any;
};

const initialState: initial = {
  PickWeek: [],
  PickTime: [],
  PickDays: [],
  IndividualTime: [],
  startHour: 10,
  endHour: 20,
  month: 6,
  presentWeek: 1,
  canPickWeek: {},
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
    clonePickWeek: (state, action: PayloadAction<any>) => {
      state.canPickWeek = lodash.cloneDeep(action.payload);
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
                      state.PickTime[j].push({
                        time: `오후 12시 00분`,
                        keNum: j,
                      });
                    } else
                      state.PickTime[j].push({
                        time: `오후 ${i - 12}시 00분`,
                        keNum: j,
                      });
                  } else if (i === 12.5) {
                    state.PickTime[j].push({
                      time: `오후 12시 30분`,
                      keNum: j,
                      hiddenText: true,
                    });
                  } else {
                    state.PickTime[j].push({
                      time: `오후 ${i - 12.5}시 30분`,
                      keNum: j,
                      hiddenText: true,
                    });
                  }
                } else {
                  if (i % 1 === 0) {
                    state.PickTime[j].push({
                      time: `오전 ${i}시 00분`,
                      keNum: j,
                    });
                  } else
                    state.PickTime[j].push({
                      time: `오전 ${i - 0.5}시 30분`,
                      keNum: j,
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
                          let m = 0;
                          for (
                            let l = state.startHour;
                            l <= state.endHour;
                            l += 0.5
                          ) {
                            if (state.PickTime[h].length - 1 !== number) {
                              state.PickTime[h].push({
                                time: l,
                                day: state.PickWeek[h].day,
                                canSee: true,
                                isWeekend: true,
                                keeNum: m,
                                color: 'white',
                              });
                              m++;
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
    addNormalTime: (state) => {
      for (let i = 1; i < 8; i++) {
        if (state.PickTime[i].length === 0) {
          const number = (state.endHour - state.startHour) * 2;
          for (let j = 0; j <= number; j++) {
            if (state.PickTime[i]) {
              state.PickTime[i].push({
                keyNum: j,
                time: j,
                day: 9999,
                canSee: false,
                trash: true,
              });
            }
          }
        }
      }
    },
    addIndividualTime: (
      state,
      action: PayloadAction<{ time: number; day: number }>
    ) => {
      if (!state.IndividualTime[action.payload.day]) {
        state.IndividualTime[action.payload.day] = [];
      } else {
        state.IndividualTime[action.payload.day].push(action.payload.time);
      }
    },
    dragTimes: (
      state,
      action: PayloadAction<{ time: number; day: number }>
    ) => {
      let selectDay = 0;

      for (let i = 1; i <= 7; i++) {
        if (state.PickTime[i]) {
          const days = state.PickTime[i].find(
            (da: any) => da.day === action.payload.day
          );
          if (days) {
            selectDay = i;
            break;
          }
        }
      }
      if (action.payload.day !== 9999) {
        const times = state.PickTime[selectDay].find(
          (ti: any) => ti.time === action.payload.time
        );
        if (times) {
          if (times.color === '#5465FF') {
            times.color = 'white';
            const { day, time } = times;
            const picking = state.IndividualTime[day].findIndex(
              (pick: any) =>
                pick.time === times.time && pick.month === times.month
            );

            if (picking) state.IndividualTime[day].splice(picking, 1);
          } else {
            times.color = '#5465FF';

            if (!state.IndividualTime) {
              state.IndividualTime = [];
            } else {
              const { day, time } = times;
              if (!state.IndividualTime[day]) {
                state.IndividualTime[day] = [];
                state.IndividualTime[day].push({ day, time });
              } else {
                state.IndividualTime[day].push({ day, time });
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
  addNormalTime,
  dragTimes,
} = individualSlice.actions;

export default individualSlice.reducer;
