import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';

export type Times = {
  day: number;
  present: boolean;
  key: number;
  color: string;
  text_color: string;
  select: boolean;
  month: number;
  week: number;
  canStart: any[];
};

type AvaliableTime = {
  start: number;
  end: number;
};

type inititial = {
  teamMonth: any;
  startHour: number;
  endHour: number;
};

type initial = {
  teamMonth: {
    1: [];
    2: [];
    3: [];
    4: [];
    5: [];
    6: [];
    7: [];
    8: [];
    9: [];
    10: [];
    11: [];
    12: [];
  };
};

const initialState: initial = {
  teamMonth: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  },
};

export const timetableSlice = createSlice({
  name: 'TIMETABLE',
  initialState,
  reducers: {
    addUseMonth: (state, action: PayloadAction) => {},
  },
});

export const {} = timetableSlice.actions;

export default timetableSlice.reducer;
