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
  select: boolean;
  month: number;
  week: number;
  opacity: number;
};

type AvaliableTime = {
  start: number;
  end: number;
};

type initial = {
  teamMonth: any;
  startHour: number;
  endHour: number;
  month: any;
  PickDays: any;
  presentWeek: number;
  PickWeek: any;
};

const initialState: initial = {
  teamMonth: {},
  startHour: 0,
  endHour: 0,
  month: dayjs().tz('Asia/Seoul').locale('ko'),
  presentWeek: 1,
  PickDays: {},
  PickWeek: [],
};

export const timetableSlice = createSlice({
  name: 'TIMETABLE',
  initialState,

  reducers: {
    setMonth: (state, action: PayloadAction<any>) => {
      state.month = action.payload;
    },
    clonePickDays: (state, action: PayloadAction<any>) => {
      state.PickDays = lodash.cloneDeep(action.payload);
    },
    nextWeek: (state) => {
      if (state.presentWeek === 5) return;
      state.presentWeek = state.presentWeek + 1;
      state.PickWeek = [];
      const preMonth = state.month.month() + 1;
      for (let i = 0; i <= 42; i++) {
        if (state.teamMonth[preMonth][i]) {
          if (state.teamMonth[preMonth][i].week === state.presentWeek) {
            state.PickWeek.push({ day: state.teamMonth[preMonth][i].day });
          }
        }
      }
    },
    prevWeek: (state) => {
      if (state.presentWeek === 1) return;
      state.presentWeek = state.presentWeek - 1;
      state.PickWeek = [];
      const preMonth = state.month.month() + 1;
      for (let i = 0; i <= 42; i++) {
        if (state.teamMonth[preMonth][i]) {
          if (state.teamMonth[preMonth][i].week === state.presentWeek) {
            state.PickWeek.push({ day: state.teamMonth[preMonth][i].day });
          }
        }
      }
    },
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
              month: state.month.month() + 1,
            });
          }
        }
      }
    },
    changeWeekColor: (state) => {
      const preMonth = state.month.month() + 1;
      const selectWeek = state.presentWeek;
      for (let i = 0; i < 42; i++) {
        state.teamMonth[preMonth][i].color = 'white';
        state.teamMonth[preMonth][i].opacity = 0.6;
        state.teamMonth[preMonth][i].select = false;
      }
      for (
        let i = (state.presentWeek - 1) * 7;
        i < state.presentWeek * 7;
        i++
      ) {
        state.teamMonth[preMonth][i].color = '#5465FF';
        state.teamMonth[preMonth][i].opacity = 0.6;
        state.teamMonth[preMonth][i].select = true;
      }
      if (state.PickDays[preMonth]) {
        for (let i = 0; i < state.PickDays[preMonth].length; i++) {
          const check = state.teamMonth[preMonth].find(
            (day: any) => day.key === state.PickDays[preMonth][i].key
          );
          if (check) {
            check.color = '#5465FF';
            check.text_color = 'white';

            check.opacity = 1;
          }
        }
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

      if (!state.teamMonth[preMonth]) {
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
        if (state.PickDays[preMonth]) {
          for (i = 0; i < state.PickDays[preMonth].length; i++) {
            const check = state.teamMonth[preMonth].find(
              (day: any) => day.key === state.PickDays[preMonth][i].key
            );
            if (check) {
              check.color = '#5465FF';
              check.text_color = 'white';
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
  nextWeek,
  prevWeek,
  clickWeek,
} = timetableSlice.actions;

export default timetableSlice.reducer;
