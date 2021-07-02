import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import lodash from 'lodash';
import { createAction } from 'redux-actions';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/indivisual';
import { takeLatest } from 'redux-saga/effects';

type changeDay = {
  check: boolean;
  day: number;
};
export type sendWeek = {
  year: number;
  month: number;
  day: number;
  time: number;
  week: number;
};

export type individual = {
  calendar_dates: sendWeek[];
  url: string;
  Authorization: string;
};

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
  change: changeDay;
  calendar_dates: sendWeek[];
  can_calendar_dates: any[];
};

const initialState: initial = {
  PickWeek: [],
  PickTime: [],
  PickDays: [],
  IndividualTime: [],
  startHour: 2,
  endHour: 8,
  month: 7,
  presentWeek: 1,
  canPickWeek: {},
  change: { check: false, day: 0 },
  calendar_dates: [],
  can_calendar_dates: [],
};

const TIMES = 'timeTable/TIMES';

export const submitTimeInfo = createAction(
  TIMES,
  (individual: individual) => individual
);

const timeSaga = createRequestSaga(TIMES, api.sendTime);

export function* individualSaga() {
  yield takeLatest(TIMES, timeSaga);
}

export const individualSlice = createSlice({
  name: 'timeTable',
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
    nextMonth: (state) => {
      state.month += 1;
    },
    prevMonth: (state) => {
      state.month -= 1;
    },
    clickIndividualMonth: (state, action: PayloadAction<any>) => {
      state.month = action.payload;
    },
    pushDates: (state) => {
      state.calendar_dates = [];

      for (let i = 1; i <= 7; i++) {
        if (state.PickTime[i]) {
          if (state.PickTime[i][0].trash === false) {
            const selectDay = state.PickTime[i][0].day;

            if (
              state.IndividualTime[state.month] &&
              state.IndividualTime[state.month][selectDay]
            ) {
              if (state.IndividualTime[state.month][selectDay].length !== 0) {
                for (
                  let j = 0;
                  j < state.IndividualTime[state.month][selectDay].length;
                  j++
                ) {
                  const { day, time, week } =
                    state.IndividualTime[state.month][selectDay][j];
                  state.calendar_dates.push({
                    year: 2021,
                    day: day,
                    time: time,
                    week: week,
                    month: state.month,
                  });
                }
              }
            }
          }
        }
      }
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
                          state.PickWeek[h].back_color = '#98A2FF';
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
                                trash: false,
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
                  canSee: false,
                  trash: true,
                });
              }
            }
          }
        }
      }
    },
    addLoginTime: (state) => {
      if (state.can_calendar_dates) {
        for (let i in state.can_calendar_dates) {
          for (let j = 1; j <= 7; j++) {
            const canDay = Number(state.can_calendar_dates[i].day);

            if (state.PickTime[j]) {
              if (canDay === state.PickTime[j][1].day) {
                console.log('존재');
                for (let k = 0; k < state.PickTime[j].length; k++) {
                  state.PickTime[j][k].trash = false;
                  state.PickTime[j][k].canSee = true;
                }
              }
            }
          }
        }
      }
    },
    cloneSever: (state, action: PayloadAction<any>) => {
      state.can_calendar_dates = lodash.cloneDeep(action.payload);
    },

    addNormalTime: (state) => {
      newFunction(state);
    },
    clonePresentWeek: (state, action: PayloadAction<number>) => {
      state.presentWeek = action.payload;
    },
    clickIndividualTime: (
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
            const picking = state.IndividualTime[state.month][day].findIndex(
              (pick: any) =>
                pick.time === times.time && pick.month === times.month
            );
            let len = state.IndividualTime[state.month][day].length;
            if (picking)
              state.IndividualTime[state.month][day].splice(picking, 1);
            if (len === 1) state.IndividualTime[state.month][day].pop();
          } else {
            times.color = '#5465FF';
            if (!state.IndividualTime) state.IndividualTime = [];
            if (!state.IndividualTime[state.month]) {
              state.IndividualTime[state.month] = [];
              const { day, time } = times;
              if (!state.IndividualTime[state.month][day]) {
                state.IndividualTime[state.month][day] = [];
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index: 0,
                  week: state.presentWeek,
                });
                state.change.check = true;
                state.change.day = day;
              } else {
                let index = state.IndividualTime[state.month][day].length;
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index,
                  week: state.presentWeek,
                });
                state.change.check = true;
                state.change.day = day;
              }
            } else {
              const { day, time } = times;
              if (!state.IndividualTime[state.month][day]) {
                state.IndividualTime[state.month][day] = [];
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index: 0,
                  week: state.presentWeek,
                });
                state.change.check = true;
                state.change.day = day;
              } else {
                let index = state.IndividualTime[state.month][day].length;
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index,
                  week: state.presentWeek,
                });
                state.change.check = true;
                state.change.day = day;
              }
            }
          }
        }
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
            const picking = state.IndividualTime[state.month][day].findIndex(
              (pick: any) =>
                pick.time === times.time && pick.month === times.month
            );
            let len = state.IndividualTime[state.month][day].length;
            if (picking)
              state.IndividualTime[state.month][day].splice(picking, 1);
            if (len === 1) state.IndividualTime[state.month][day].pop();
          } else {
            times.color = '#5465FF';
            if (!state.IndividualTime) state.IndividualTime = [];
            if (!state.IndividualTime[state.month]) {
              state.IndividualTime[state.month] = [];
              const { day, time } = times;
              if (!state.IndividualTime[state.month][day]) {
                state.IndividualTime[state.month][day] = [];
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index: 0,
                  week: state.presentWeek,
                });
              } else {
                let index = state.IndividualTime[state.month][day].length;
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index,
                  week: state.presentWeek,
                });
              }
            } else {
              const { day, time } = times;
              if (!state.IndividualTime[state.month][day]) {
                state.IndividualTime[state.month][day] = [];
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index: 0,
                  week: state.presentWeek,
                });
              } else {
                let index = state.IndividualTime[state.month][day].length;
                state.IndividualTime[state.month][day].push({
                  day,
                  time,
                  index,
                  week: state.presentWeek,
                });
              }
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

    setTimeColor: (state) => {
      let selectDay = 8888;
      var day = 8888;
      if (state.PickWeek[7]) {
        state.PickWeek.forEach((element: any) => {
          if (state.IndividualTime[state.month]) {
            for (let i = 1; i <= 7; i++) {
              if (state.PickTime[i]) {
                const days = state.PickTime[i].find(
                  (da: any) => da.day === element.day
                );
                if (days) {
                  selectDay = i;
                  day = element.day;
                  break;
                }
              }
            }
            if (selectDay !== 8888) {
              if (state.IndividualTime[state.month][day]) {
                for (
                  let j = 0;
                  j < state.IndividualTime[state.month][day].length;
                  j++
                ) {
                  if (state.PickTime[selectDay][j]) {
                    const find = state.PickTime[selectDay].findIndex(
                      (fi: any) =>
                        fi.time ===
                        state.IndividualTime[state.month][day][j].time
                    );
                    if (find === 0) {
                      state.PickTime[selectDay][0].color = '#5465FF';
                    }

                    if (find) {
                      state.PickTime[selectDay][find].color = '#5465FF';
                    }
                  }
                }
              }
            }
          }
        });
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
  clickIndividualTime,
  setTimeColor,
  nextMonth,
  prevMonth,
  clickIndividualMonth,
  clonePresentWeek,
  pushDates,
  cloneSever,
  addLoginTime,
} = individualSlice.actions;

export default individualSlice.reducer;
function newFunction(state: any) {
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
}
