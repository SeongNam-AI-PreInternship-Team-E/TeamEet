import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import 'dayjs/plugin/utc';

export type Days = {
  day: number;
  present: boolean;
  key: number;
  color: string;
  text_color: string;
};
type initial = {
  weekOfDay: any[];
  Days: Days[];
  month: any;
  start_hour: number;
  end_hour: number;
};
export type Times = {
  start_hour: string;
  end_hour: string;
};

export type DaysState = Days[];
export type TimesState = Times[];

const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);

const initialState: initial = {
  weekOfDay: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  Days: [],
  month: dayjs().tz('Asia/Seoul').locale('ko'),

  start_hour: 0,
  end_hour: 0,
};

export const daysSlice = createSlice({
  name: 'DAYS',
  initialState,
  reducers: {
    addDays: (state) => {
      state.Days.push();
      let i = 1;
      let k = 0;
      const LastMonth = state.month.subtract(1, 'M');
      const LastMonthEndDay = LastMonth.endOf('M');

      const presentMonthStartDay = state.month.startOf('M').day();
      const preDate = state.month.endOf('M').date();

      let subDate = LastMonthEndDay.date();
      console.log(subDate);
      for (i = subDate - presentMonthStartDay + 1; i <= subDate; i++) {
        state.Days.push({
          day: i,
          present: false,
          key: k,
          color: 'white',
          text_color: 'black',
        });
        k++;
      }
      for (i = 1; i <= preDate; i++) {
        state.Days.push({
          day: i,
          present: true,
          key: k,
          color: 'white',
          text_color: 'black',
        });
        k++;
      }
      i = 1;
      while (state.Days.length !== 42) {
        state.Days.push({
          day: i,
          present: false,
          key: k,
          color: 'white',
          text_color: 'black',
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
    changeStarDay: (state, action: PayloadAction<number>) => {
      state.start_hour = action.payload;
    },
    changeEndDay: (state, action: PayloadAction<number>) => {
      state.end_hour = action.payload;
    },
    dragMonth: (state, action: PayloadAction<number>) => {
      // for (let i = state.start_hour; i <= state.end_hour; i++) {
      //   const day = state.Days.find((day) => day.key === i);
      //   if (day) {
      //     day.color = '#5465FF';
      //   }
      // }
      const day = state.Days.find((day) => day.key === action.payload);
      if (day) {
        if (day.color === '#5465FF') {
          day.color = 'white';
          day.text_color = 'black';
        } else {
          day.color = '#5465FF';
          day.text_color = 'white';
        }
      }
    },
    clickMonth: (state, action: PayloadAction<number>) => {
      const day = state.Days.find((day) => day.key === action.payload);
      if (day) {
        if (day.color === '#5465FF') {
          day.color = 'white';
          day.text_color = 'black';
        } else {
          day.color = '#5465FF';
          day.text_color = 'white';
        }
      }
    },
  },
});

export const {
  addDays,
  prevMonth,
  nextMonth,
  changeEndDay,
  changeStarDay,
  dragMonth,
  clickMonth,
} = daysSlice.actions;

export default daysSlice.reducer;
