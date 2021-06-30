import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/api';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';

export type user = {
  user: string;
  checkError: string;
};

const CHECK = 'user/CHECK';

export const check = createAction(CHECK);

const checkSaga = createRequestSaga(CHECK, api.getPost);
export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
}

const initialState: user = {
  user: '',
  checkError: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    tempSetUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    CHECK_USER_SUCCESS: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    CHECK_USER_FAILURE: (state, action: PayloadAction<any>) => {
      state.user = '';
      state.checkError = action.payload;
    },
  },
});

export const { tempSetUser, CHECK_USER_FAILURE, CHECK_USER_SUCCESS } =
  userSlice.actions;

export default userSlice.reducer;
