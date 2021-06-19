import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Days = {
  id: number;
  day: string;
  check: boolean;
};
export type Times = {
  start_hour: string;
  end_hour: string;
};

export type DaysState = Days[];
export type TimesState = Times[];

let nextId = 1;
const initialState = {
  Days: [
    { id: 1, day: '월요일', check: false },
    { id: 2, day: '화요일', check: false },
    { id: 3, day: '수요일', check: false },
    { id: 4, day: '목요일', check: false },
    { id: 5, day: '금요일', check: false },
    { id: 6, day: '토요일', check: false },
    { id: 7, day: '일요일', check: false },
  ],
  Availiable: [0],
  start_hour: 6,
  end_hour: 24,
};

export const daysSlice = createSlice({
  name: 'DAYS',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<number>) => {
      state.Availiable.push(action.payload);
      console.log(state);
    },
    setStartHour: (state, action: PayloadAction<number>) => {
      state.start_hour = action.payload;
    },
    setEndHour: (state, action: PayloadAction<number>) => {
      state.end_hour = action.payload;
    },
    // removeTodo: (state, action: PayloadAction<number>) => {
    //   const todo = state.findIndex((todo) => todo.id === action.payload);
    //   state.splice(todo, 1);
    // },
    toggleDays: (state, action: PayloadAction<number>) => {
      const days = state.Days.find((day) => day.id === action.payload);
      if (days) {
        days.check = !days.check;
      }
    },
  },
});

export const { toggleDays, addTodo, setStartHour, setEndHour } =
  daysSlice.actions;

export default daysSlice.reducer;
