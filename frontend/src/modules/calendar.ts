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
import { date } from 'fp-ts';
export type Days = {
  day: number;
  present: boolean;
  key: number;
  color: string;
  text_color: string;
  select: boolean;
  month: number;
  week: number;
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
  page: Page;
  Dates: Date[];
};
export type Times = {
  start_hour: string;
  end_hour: string;
};

export type DaysState = Days[];
export type TimesState = Times[];

const PAGE = 'calendar/PAGE';
const DATES = 'calendar/DATES';

export const submitPageInfo = createAction(PAGE, (page: Page) => page);
export const submitDatesInfo = createAction(DATES, (date: Date) => date);

const pageSaga = createRequestSaga(PAGE, api.sendPage);
const dateSaga = createRequestSaga(DATES, api.sendDates);

export function* calendarSaga() {
  yield takeLatest(PAGE, pageSaga);
  yield takeLatest(DATES, dateSaga);
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
  page: {
    title: '',
    max_time: 9,
    min_time: 12,
  },
  Dates: [],
};

export const daysSlice = createSlice({
  name: 'days',
  initialState,
  reducers: {
    PAGE_SUCCESS: (state, action: PayloadAction<any>) => {
      state.page = action.payload;
    },
    DATES_SUCCESS: (state, action: PayloadAction<any>) => {
      state.Dates = action.payload;
    },
    setDay: (state, action: PayloadAction<any>) => {
      state.month = action.payload;
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
      console.log(subDate);
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
          const { day, month, key, week } = days;
          if (state.PickDays[month])
            state.PickDays[month].push({ day, month, key, week });
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
          const { day, month, key, week } = days;
          if (!state.PickDays[month]) {
            state.PickDays[month - 1] = [];
            state.PickDays[month] = [];
            state.PickDays[month + 1] = [];
          }
          state.PickDays[month].push({ day, month, key, week });
        }
      }
    },
    addTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    addUseMonth: (state, action: PayloadAction) => {},
  },
});
// 에어팟좀 찾골올게요네

export const {
  addDays,
  prevMonth,
  nextMonth,
  dragMonth,
  clickMonth,
  addTitle,
  setDay,
  setInitialDate,
} = daysSlice.actions;

export default daysSlice.reducer;
