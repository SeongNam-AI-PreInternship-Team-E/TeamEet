import {
  createSlice,
  miniSerializeError,
  PayloadAction,
} from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { createAction } from 'redux-actions';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/admin';
import { takeLatest } from 'redux-saga/effects';
import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';
export type Days = {
  day: number;
  present: boolean;
  key: number;
  color: string;
  text_color: string;
  select: boolean;
  month: number;
  week: number;
  weekOfDay: number;
  year: number;
};
export type PickDay = {
  month: number;
  day: number;
};

export type Page = {
  title: string;
  min_time: number;
  max_time: number;
};

export type Date = {
  year: number;
  month: number;
  day: number;
  day_of_week: string;
};

export type Info = {
  page: Page;
  solve: Date[];
};

type initial = {
  weekOfDay: any[];
  Days: Days[];
  month: any;
  PickDays: any;
  start_hour: number;
  end_hour: number;
  title: string;
  pickArr: number[];
  teamMonth: any;
  info: Info;
  url: string;
  response: any;
  error: string;
};
export type Times = {
  start_hour: string;
  end_hour: string;
};

export type DaysState = Days[];
export type TimesState = Times[];

const PAGE = 'calendar/PAGE';

export const submitPageInfo = createAction(PAGE, (info: Info) => info);

const pageSaga = createRequestSaga(PAGE, api.sendPage);

export function* calendarSaga() {
  yield takeLatest(PAGE, pageSaga);
}

const initialState: initial = {
  weekOfDay: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  Days: [],
  PickDays: [],
  month: dayjs(),
  title: '',
  start_hour: 0,
  end_hour: 0,
  pickArr: [],
  teamMonth: {},
  info: {
    page: {
      title: '',
      max_time: 0,
      min_time: 0,
    },
    solve: [],
  },
  url: '',
  response: '',
  error: '',
};

export const daysSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    PAGE_SUCCESS: (state, action: PayloadAction<any>) => {
      state.response = action.payload;
      state.url = state.response.private_pages[0].url;
    },
    PAGE_FAILURE: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    setDay: (state, action: PayloadAction<any>) => {
      state.month = action.payload;
    },
    setStartCal: (state, action: PayloadAction<any>) => {
      state.info.page.min_time = action.payload;
    },
    setEndCal: (state, action: PayloadAction<any>) => {
      state.info.page.max_time = action.payload;
    },
    setInitialDate: (state) => {
      state.Days = [];
    },
    addDays: (state) => {
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

      for (i = subDate - presentMonthStartDay + 1; i <= subDate; i++) {
        state.Days.push({
          day: i,
          present: false,
          key: k,
          color: 'white',
          text_color: 'black',
          month: LastMonthNum,
          select: false,
          week: Math.floor(k / 7) + 1,
          weekOfDay: k % 7,
          year: 2021,
        });
        k++;
      }

      if (state.PickDays[preMonth]) {
        if (state.PickDays[preMonth].length !== 0) {
          for (let j = 0; j < state.PickDays[preMonth].length; j++) {
            state.pickArr.push(state.PickDays[preMonth][j].key);
          }
        }
      }

      for (i = 1; i <= preDate; i++) {
        state.Days.push({
          day: i,
          present: true,
          key: k,
          color: 'white',
          text_color: 'black',
          month: preMonth,
          select: false,
          week: Math.floor(k / 7) + 1,
          weekOfDay: k % 7,
          year: 2021,
        });
        k++;
      }
      for (i = 0; i < state.pickArr.length; i++) {
        const check = state.Days.find((day) => day.key === state.pickArr[i]);
        if (check) {
          check.color = '#5465FF';
          check.text_color = 'white';
        }
      }
      state.pickArr = [];
      i = 1;
      while (state.Days.length !== 42) {
        state.Days.push({
          day: i,
          present: false,
          key: k,
          color: 'white',
          text_color: 'black',
          month: NextMonth,
          select: false,
          week: Math.floor(k / 7) + 1,
          weekOfDay: k % 7,
          year: 2021,
        });
        i++;
        k++;
      }
    },

    nextMonth: (state) => {
      state.Days = [];
      state.month = state.month.add(1, 'M');
      addDays();
    },
    prevMonth: (state) => {
      state.Days = [];
      state.month = state.month.subtract(1, 'M');
      addDays();
    },
    newMonth: (state, action: PayloadAction<any>) => {
      state.Days = [];
      state.month = state.month.add(1, 'M');
      addDays();
    },

    dragMonth: (state, action: PayloadAction<number>) => {
      const days = state.Days.find((days) => days.key === action.payload);
      if (days) {
        if (days.color === '#5465FF') {
          days.color = 'white';
          days.text_color = 'black';
          const { month } = days;
          const picking = state.PickDays[month].findIndex(
            (pick: any) => pick.day === days.day && pick.month === days.month
          );
          if (picking) state.PickDays[month].splice(picking, 1);
        } else if (days.present) {
          days.color = '#5465FF';
          days.text_color = 'white';
          const { day, month, key, week, weekOfDay, year } = days;
          if (state.PickDays[month])
            state.PickDays[month].push({
              day,
              month,
              key,
              week,
              weekOfDay,
              year,
            });
        }
      }
    },
    clickMonth: (state, action: PayloadAction<number>) => {
      const days = state.Days.find((days) => days.key === action.payload);
      if (days) {
        if (days.color === '#5465FF') {
          days.color = 'white';
          days.text_color = 'black';
          const { month } = days;
          const picking = state.PickDays[month].findIndex(
            (pick: any) => pick.day === days.day && pick.month === days.month
          );
          if (picking) state.PickDays[month].splice(picking, 1);
        } else if (days.present) {
          days.color = '#5465FF';
          days.text_color = 'white';
          const { day, month, key, week, weekOfDay, year } = days;
          if (!state.PickDays[month]) {
            state.PickDays[month - 1] = [];
            state.PickDays[month] = [];
            state.PickDays[month + 1] = [];
          }
          state.PickDays[month].push({
            day,
            month,
            key,
            week,
            year,
            weekOfDay,
          });
        }
      }
    },
    addTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.info.page.title = action.payload;
    },
    addUseMonth: (state) => {
      state.info.page.title = state.title;
      state.info.page.min_time = state.start_hour;
      state.info.page.max_time = state.end_hour;
    },
    addUseDaysCal: (state) => {
      if (state.PickDays)
        for (let j = 0; j < state.PickDays.length; j++) {
          if (state.PickDays[j]) {
            for (let i = 0; i < state.PickDays[j].length; i++) {
              const { day, month, weekOfDay, year, key } = state.PickDays[j][i];
              state.info.solve.push({
                day: day,
                month: month,
                day_of_week: key,
                year: year,
              });
            }
          }
        }
    },
  },
});

export const {
  addDays,
  prevMonth,
  nextMonth,
  dragMonth,
  clickMonth,
  addTitle,
  setDay,
  setInitialDate,
  setStartCal,
  setEndCal,
  addUseMonth,
  addUseDaysCal,
  PAGE_SUCCESS,
  PAGE_FAILURE,
} = daysSlice.actions;

export default daysSlice.reducer;
