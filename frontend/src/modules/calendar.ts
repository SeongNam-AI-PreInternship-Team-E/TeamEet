import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export type Days = {
  day: number;
  present: boolean;
  key: number;
  color: string;
  text_color: string;
  month: number;
};
type initial = {
  weekOfDay: any[];
  Days: Days[];
  month: any;
  start_hour: number;
  end_hour: number;
  title: string;
};
export type Times = {
  start_hour: string;
  end_hour: string;
};

export type DaysState = Days[];
export type TimesState = Times[];



const initialState: initial = {
  weekOfDay: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  Days: [],
  month: dayjs(),
  title: '',
  start_hour: 0,
  end_hour: 0,
};

export const daysSlice = createSlice({
  name: 'DAYS',
  initialState,
  reducers: {
    setDay: (state, action: PayloadAction<any>) => {
      state.month = action.payload
    },
    setInitialDate: (state) => {
      state.Days = []
    },
    addDays: (state) => {
      state.Days.push();
      let i = 1;
      let k = 0;
      const LastMonth = state.month.subtract(1, 'M');
      const LastMonthEndDay = LastMonth.endOf('M');
      const LastMonthNum = LastMonth.month();

      const presentMonthStartDay = state.month.startOf('M').day();
      const preDate = state.month.endOf('M').date();
      const preMonth = state.month;
    
      const NextMonth = state.month.add(1, 'M').month();

      let subDate = LastMonthEndDay.date();
      console.log(subDate);
      for (i = subDate - presentMonthStartDay + 1; i <= subDate; i++) {
        state.Days.push({
          day: i,
          present: false,
          key: k,
          color: 'white',
          text_color: 'black',
          month: LastMonthNum
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
          month: preMonth,
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
          month: NextMonth,
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
    addTitle: (state, action: PayloadAction<string>) => {
      state.title= action.payload;
    }
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
  addTitle,
  setDay,
  setInitialDate,
} = daysSlice.actions;

export default daysSlice.reducer;
