import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';
import lodash from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import 'dayjs/plugin/utc';

const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
export type Times = {
  day: number;
  present: boolean;
  key: number;
  color: string;
  text_color: string;
  availKey: any[];
  select: boolean;
  month: number;
  week: number;
  opacity: number;
};

type AvaliableTime = {
  start: number;
  end: number;
};

export type initialTimeTable = {
  weekOfDay: any;
  teamMonth: any;
  startHour: number;
  endHour: number;
  month: any;
  PickDays: any;
  presentWeek: number;
  PickWeek: any;
  canPickWeek: any;
  canPickMonth: any;
  showSelect: number;
  calendar_dates: any[];
  availKey: any[];
  url2: string;
};

const initialState: initialTimeTable = {
  weekOfDay: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  teamMonth: {},
  startHour: 0,
  endHour: 0,
  month: dayjs().tz('Asia/Seoul').locale('ko'),
  presentWeek: 1,
  PickDays: [],
  PickWeek: [],
  canPickWeek: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  },
  canPickMonth: [],
  showSelect: 1,
  calendar_dates: [],
  availKey: [],
  url2: '',
};

export const timetableSlice = createSlice({
  name: 'TIMETABLE',
  initialState,

  reducers: {
    setMonth: (state, action: PayloadAction<any>) => {
      state.month = action.payload;
    },
    cloneUrl: (state, action: PayloadAction<string>) => {
      state.url2 = action.payload;
    },
    clonePickDays: (state, action: PayloadAction<any>) => {
      state.PickDays = lodash.cloneDeep(action.payload);
    },
    cloneInDates: (state, action: PayloadAction<any>) => {
      state.calendar_dates = lodash.cloneDeep(action.payload);
    },
    searchMinWeek: (state) => {
      if (state.canPickWeek) {
        for (let i = 6; i >= 1; i--) {
          if (state.canPickWeek[i]) state.showSelect = i;
        }
      }
    },
    addUseInDay: (state) => {
      if (state.PickDays.length === 0) {
        const preMonth = state.month.month() + 1;
        if (state.calendar_dates) {
          for (let i = 0; i < state.calendar_dates.length; i++) {
            if (
              state.month.month() + 1 ===
              Number(state.calendar_dates[i].month)
            ) {
              const findDay = state.teamMonth[preMonth].find(
                (day: any) =>
                  day.key === Number(state.calendar_dates[i].day_of_week)
              );
              if (findDay) {
                const canPick = Math.floor(findDay.key / 7) + 1;
                if (state.canPickWeek[canPick] === false) {
                  state.canPickWeek[canPick] = true;
                }
                state.availKey.push({
                  key: findDay.key,
                  week: canPick,
                  month: findDay.month,
                });
                findDay.color = '#5465FF';
                findDay.text_color = 'white';
              }
            }
          }
        }
      }
    },
    canChoosePick: (state) => {
      if (state.PickDays) {
        let count = 1;
        state.PickDays.forEach((element: any) => {
          if (element) {
            if (element.length !== 0) {
              if (count === 1) {
                state.canPickMonth.push({
                  month: element[0].month,
                  keyNum: element[0].month,
                  select: true,
                });
                count++;
              } else {
                state.canPickMonth.push({
                  month: element[0].month,
                  keyNum: element[0].month,
                  select: false,
                });
              }
            }
          }
        });
      }
    },
    // clickWeek: (state, action: PayloadAction<any>) => {
    //   const preMonth = state.month.month() + 1;
    //   const presentWeek = state.teamMonth[preMonth].find(
    //     (day: any) =>
    //       day.day === action.payload.day && day.month === action.payload.month
    //   );
    //   if (presentWeek) {
    //     console.log('존재', presentWeek);
    //     state.presentWeek = presentWeek.week;
    //     if (action.payload.month < state.month.month() + 1) {
    //       state.month = state.month.subtract(1, 'M');
    //       console.log('작음');

    //       return;
    //     } else if (action.payload.month > state.month.month() + 1) {
    //       state.month = state.month.add(1, 'M');
    //       console.log('큼');

    //       return;
    //     }
    //   } else {
    //     console.log('존재안함');
    //   }

    //   state.PickWeek = [];
    //   for (let i = 0; i <= 42; i++) {
    //     if (state.teamMonth[preMonth][i]) {
    //       if (state.teamMonth[preMonth][i].week === state.presentWeek) {
    //         state.PickWeek.push({
    //           day: state.teamMonth[preMonth][i].day,
    //           week: state.presentWeek,
    //           month: state.teamMonth[preMonth][i].month,
    //         });
    //       }
    //     }
    //   }
    // },
    clickWeek: (state, action: PayloadAction<any>) => {
      state.presentWeek = action.payload;
      const preMonth = state.month.month() + 1;
      state.PickWeek = [];
      for (let i = 0; i <= 42; i++) {
        if (state.teamMonth[preMonth][i]) {
          if (state.teamMonth[preMonth][i].week === action.payload) {
            state.PickWeek.push({
              day: state.teamMonth[preMonth][i].day,
              week: state.presentWeek,
              month: state.teamMonth[preMonth][i].month,
              back_color: 'white',
            });
          }
        }
      }
    },
    changeWeekColor: (state) => {
      const preMonth = state.month.month() + 1;
      const lastMonth = preMonth - 1;
      const nextMonth = preMonth + 1;
      const selectWeek = state.presentWeek;
      for (let i = 0; i < 42; i++) {
        state.teamMonth[preMonth][i].color = 'white';
        state.teamMonth[preMonth][i].opacity = 0.3;
        state.teamMonth[preMonth][i].select = false;
      }
      for (
        let i = (state.presentWeek - 1) * 7;
        i < state.presentWeek * 7;
        i++
      ) {
        // state.teamMonth[preMonth][i].color = '#5465FF';
        state.teamMonth[preMonth][i].opacity = 0.6;
        state.teamMonth[preMonth][i].select = true;
      }
      if (state.PickDays[lastMonth]) {
        for (let i = 0; i < state.PickDays[lastMonth].length; i++) {
          if (state.teamMonth[preMonth]) {
            const check = state.teamMonth[preMonth].find(
              (day: any) =>
                day.day === state.PickDays[lastMonth][i].day &&
                day.month === state.PickDays[lastMonth][i].month
            );
            if (check) {
              check.color = '#5465FF';
              check.text_color = 'white';
              check.opacity = 0.4;

              state.canPickWeek[1] = true;
              state.showSelect = 1;
            }
          }
        }
      }

      if (state.PickDays[preMonth]) {
        for (let i = 0; i < state.PickDays[preMonth].length; i++) {
          const check = state.teamMonth[preMonth].find(
            (day: any) => day.key === state.PickDays[preMonth][i].key
          );
          if (check) {
            check.color = '#5465FF';
            check.text_color = 'white';
            check.opacity = 0.4;
            let thisWeek = state.PickDays[preMonth][i].week;
            state.canPickWeek[thisWeek] = true;
          }
        }
      }

      if (state.PickDays[nextMonth]) {
        for (let i = 0; i < state.PickDays[nextMonth].length; i++) {
          if (state.teamMonth[preMonth]) {
            const check = state.teamMonth[preMonth].find(
              (day: any) =>
                day.day === state.PickDays[nextMonth][i].day &&
                day.month === state.PickDays[nextMonth][i].month
            );
            if (check) {
              check.color = '#5465FF';
              check.text_color = 'white';
              check.opacity = 0.4;
            }
          }
        }
      }
    },
    clickMonth: (state, action: PayloadAction<number>) => {
      let myMonth = action.payload;
      let sysMonth = state.month.month() + 1;
      let count = myMonth - sysMonth; // 현재 시간에서 시스템 달 빼기
      state.canPickWeek = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };
      if (count > 0) {
        state.month = state.month.add(count, 'M');
      } else if (count < 0) {
        count *= -1;
        state.month = state.month.subtract(count, 'M');
      } else {
        return;
      }
    },
    addUseMonth: (state, action: PayloadAction) => {
      let i = 1;
      let k = 0;
      const LastMonth = state.month.subtract(1, 'M');
      const LastMonthEndDay = LastMonth.endOf('M');
      const LastMonthNum = LastMonth.month() + 1;

      const presentMonthStartDay = state.month.startOf('M').day();
      const preDate = state.month.endOf('M').date();
      const preMonth = state.month.month() + 1;

      const NextMonth = state.month.add(1, 'M').month() + 1;

      let subDate = LastMonthEndDay.date();
      // state.teamMonth[preMonth] = [];
      if (!state.teamMonth[preMonth]) {
        // 현재 달 없을 경우 새로 생성
        state.teamMonth[preMonth] = [];
        for (i = subDate - presentMonthStartDay + 1; i <= subDate; i++) {
          state.teamMonth[preMonth].push({
            day: i,
            present: false,
            key: k,
            color: 'white',
            text_color: 'black',
            month: LastMonthNum,
            select: false,
            week: Math.floor(k / 7) + 1,
            opacity: 1,
          });
          k++;
        }
        // 이전 달에서 체크 된 날짜 있는지 체크
        if (state.PickDays[LastMonth]) {
          for (i = 0; i < state.PickDays[LastMonth].length; i++) {
            const check = state.teamMonth[LastMonth].find(
              (day: any) => day.key === state.PickDays[LastMonth][i].key
            );
            if (check) {
              check.color = '#5465FF';
              check.text_color = 'white';
              check.opacity = 0.5;
            }
          }
        }
        for (i = 1; i <= preDate; i++) {
          state.teamMonth[preMonth].push({
            day: i,
            present: true,
            key: k,
            color: 'white',
            text_color: 'black',
            month: preMonth,
            select: false,
            week: Math.floor(k / 7) + 1,
            opacity: 1,
          });
          k++;
        }
        // 현재 달에서 선택된 날짜 찾아서 바꿔주기
        if (state.PickDays[preMonth]) {
          for (i = 0; i < state.PickDays[preMonth].length; i++) {
            const check = state.teamMonth[preMonth].find(
              (day: any) => day.key === state.PickDays[preMonth][i].key
            );
            if (check) {
              check.color = '#5465FF';
              check.text_color = 'white';
              check.opacity = 0.5;
            }
          }
        }
        i = 1;
        while (state.teamMonth[preMonth].length !== 42) {
          state.teamMonth[preMonth].push({
            day: i,
            present: false,
            key: k,
            color: 'white',
            text_color: 'black',
            month: NextMonth,
            select: false,
            week: Math.floor(k / 7) + 1,
            opacity: 1,
          });
          i++;
          k++;
        }
      }
    },
  },
});

export const {
  setMonth,
  clonePickDays,
  addUseMonth,
  changeWeekColor,
  addUseInDay,
  canChoosePick,
  clickWeek,
  searchMinWeek,
  clickMonth,

  // clickWeek2,
  cloneInDates,
} = timetableSlice.actions;

export default timetableSlice.reducer;
