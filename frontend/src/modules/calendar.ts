import { createSlice, miniSerializeError, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export type Days = {
  day: number;
  present: boolean;
  key: number;
  color: string;
  text_color: string;
  select: boolean;
  month: number;
};
export type PickDay = {
  month: number,
  day: number


}

type initial = {
  weekOfDay: any[];
  Days: Days[];
  month: any;
  PickDays: any;
  start_hour: number;
  end_hour: number;
  title: string;
  pickArr: number[];
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
  PickDays:{1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11:[], 12:[]},
  month: dayjs(),
  title: '',
  start_hour: 0,
  end_hour: 0,
  pickArr: [],
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
        });
        k++;
      }

      
       if (state.PickDays[preMonth].length!==0) {
           for (let j=0; j< state.PickDays[preMonth].length; j++){
             state.pickArr.push(state.PickDays[preMonth][j].key)
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
        });
        k++;
      }
      for (i=0; i<state.pickArr.length; i++) {
        const check = state.Days.find((day)=> day.key === state.pickArr[i]);
        if (check) check.color ='#5465FF';
      }
      state.pickArr=[]
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
          const {month} = days;
          const picking = state.PickDays[month].findIndex((pick:any)=> pick.day === days.day && pick.month === days.month)
          if (picking) state.PickDays[month].splice(picking, 1);
        } else if(days.present) {
          days.color = '#5465FF';
          days.text_color = 'white';
          const {day,month, key } = days;
          
          state.PickDays[month].push({day, month, key})
        }
      }
    },
    clickMonth: (state, action: PayloadAction<number>) => {
      const days = state.Days.find((days) => days.key === action.payload);
      if (days) {
        if (days.color === '#5465FF') {
          days.color = 'white';
          days.text_color = 'black';
          const {month} = days;
          const picking = state.PickDays[month].findIndex((pick:any)=> pick.day === days.day && pick.month === days.month)
          if (picking) state.PickDays[month].splice(picking, 1);
        } else if(days.present) {
          days.color = '#5465FF';
          days.text_color = 'white';
          const {day,month,key } = days;
          
          state.PickDays[month].push({day, month, key})
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
  dragMonth,
  clickMonth,
  addTitle,
  setDay,
  setInitialDate,
} = daysSlice.actions;

export default daysSlice.reducer;
