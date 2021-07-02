import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import lodash from 'lodash';
import 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import 'dayjs/plugin/utc';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/team';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';

const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);

type calendar_date = {
  id: number;
  year: string;
  month: number;
  day: string;
  day_of_week: string;
  private_page_id: number;
};

type start_end = {
  start_time: number;
  end_time: number;
};

export type TeamTime = {
  teamMonth: any;
  thisWeek: any;
  month: any;
  avail_Month: any;
  makingNew: boolean;
  calendar_dates: calendar_date[];
  availableMonth: number[];
  availKey: any;
  canPickWeek: any;
  start_time: number;
  end_time: number;
  PickTime: any[];
  url: string;
  response: any;
  presentWeek: number;
  PickWeek: any[];
  PickDays: any[];
  monthNum: number;
};

const initialState: TeamTime = {
  teamMonth: {},
  thisWeek: [],
  month: dayjs().tz('Asia/Seoul').locale('ko'),
  monthNum: 0,
  makingNew: false,
  avail_Month: [],
  calendar_dates: [],
  availableMonth: [],
  availKey: [],
  canPickWeek: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  },
  start_time: 0,
  end_time: 0,
  PickTime: [],
  url: '',
  response: '',
  presentWeek: 1,
  PickWeek: [],
  PickDays: [],
};

const TEAM = 'team/TEAM';

export const getTeamInfo = createAction(TEAM, (url: string) => url);

const teamTimeSaga = createRequestSaga(TEAM, api.getTime);

export function* teamSaga() {
  yield takeLatest(TEAM, teamTimeSaga);
}

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    TEAM_SUCCESS: (state, action: PayloadAction<any>) => {
      state.response = action.payload;
    },
    makingNew: (state) => {
      state.makingNew = false;
    },
    cloneDates: (state, action: PayloadAction<any>) => {
      state.calendar_dates = lodash.cloneDeep(action.payload);
    },
    cloneStartEnd: (state, action: PayloadAction<start_end>) => {
      state.start_time = action.payload.start_time;
      state.end_time = action.payload.end_time;
    },
    changeWeekColor: (state, action: PayloadAction<number>) => {
      const preMonth = state.month.month() + 1;
      for (let i = 0; i <= 42; i++) {
        if (state.teamMonth[preMonth][i]) {
          state.teamMonth[preMonth][i].color = 'white';
          state.teamMonth[preMonth][i].text_color = 'black';
          state.teamMonth[preMonth][i].opacity = 0.5;
        }
      }
      for (let i = (action.payload - 1) * 7; i <= action.payload * 7 - 1; i++) {
        state.teamMonth[preMonth][i].color = 'white';
        if (state.teamMonth[preMonth][i].present) {
          state.teamMonth[preMonth][i].opacity = 1;
        } else {
          state.teamMonth[preMonth][i].opacity = 0.3;
        }
      }
      if (state.availKey) {
        for (let i = 0; i < state.availKey.length; i++) {
          if (state.availKey[i].month === state.month.month() + 1) {
            if (state.availKey[i].week === action.payload) {
              state.teamMonth[preMonth][state.availKey[i].key].color =
                '#5465FF';
              state.teamMonth[preMonth][state.availKey[i].key].opacity = 1;
              state.teamMonth[preMonth][state.availKey[i].key].text_color =
                'white';
            } else {
              state.teamMonth[preMonth][state.availKey[i].key].color =
                '#5465FF';
              state.teamMonth[preMonth][state.availKey[i].key].opacity = 0.5;
              state.teamMonth[preMonth][state.availKey[i].key].text_color =
                'white';
            }
          }
        }
      }
    },
    addUseDay: (state) => {
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
    },
    addTeamMonth: (state) => {
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
      }
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
          year: 2021,
          opacity: 0.3,
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
          year: 2021,
          opacity: 0.5,
        });
        k++;
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
          year: 2021,
          opacity: 0.3,
        });
        i++;
        k++;
      }
    },
    clickWeek: (state, action: PayloadAction<any>) => {
      state.presentWeek = action.payload;
      const preMonth = state.month.month() + 1;
      state.PickWeek = [];
      state.PickWeek.push({ day: 0 });
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
    addTimes: (state) => {
      const number = (state.end_time - state.start_time) * 2;
      for (let i = 0; i < 8; i++) {
        state.PickTime[i] = [];
      }
      if (state.PickTime) {
        for (let j = 0; j <= 0; j++) {
          for (let i = state.start_time; i <= state.end_time; i += 0.5) {
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
              }
            }
          }
        }
      }
    },
    cloneUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    pushData: (state) => {
      for (let i = 1; i <= 7; i++) {
        for (let j = state.start_time; j <= state.end_time; j += 0.5) {
          if (state.PickWeek[i]) {
            const { day, month, week } = state.PickWeek[i];
            state.PickTime[i].push({
              day: day,
              month: month,
              week: week,
              time: j,
              index: j,
              count: 0,
              color: 'white',
              canSee: false,
              trash: true,
            });
          }
        }
      }
    },
    changeColor: (state, action: PayloadAction<any>) => {
      state.monthNum = state.month.month() + 1;
      if (action.payload !== '') {
        if (state.response[state.monthNum]) {
          for (let i in state.response[state.monthNum].avail_date) {
            const date = state.response[state.monthNum].avail_date[i];
            for (let j = 1; j <= 7; j++) {
              if (state.PickWeek[j]) {
                if (date === state.PickWeek[j].day) {
                  for (let k in state.response[state.monthNum][date]
                    .avail_time) {
                    const ktime =
                      state.response[state.monthNum][date].avail_time[k];
                    console.log('index', k);
                    const find = state.PickTime[j].find(
                      (time: any) => time.time === ktime
                    );
                    if (find) {
                      const count =
                        state.response[state.monthNum][date].count[k];
                      switch (count) {
                        case 1:
                          find.color = '#98a2ff';
                          break;
                        case 2:
                          find.color = '#5465FF';
                          break;
                        case 3:
                          find.color = '#5465FF';
                          break;
                        case 4:
                          find.color = '#5465FF';
                          break;
                        case 5:
                          find.color = '#5465FF';
                      }
                      find.canSee = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  },
});

export const {
  addTeamMonth,
  addUseDay,
  makingNew,
  cloneDates,
  changeWeekColor,
  cloneUrl,
  clickWeek,
  cloneStartEnd,
  addTimes,
  pushData,
  changeColor,
} = teamSlice.actions;

export default teamSlice.reducer;
