import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';

export type User = {
  id: string;
  pw: string;
  register: { id: string; pw: string };
  form: string;
  auth: null;
  authError: null;
};

type LoginOrPassword = {
  key: string;
  value: string;
};

export type IdPw = {
  id: string;
  pw: string;
};

const REGISTER = 'auth/REGISTER';
const LOGIN = 'auth/LOGIN';
export const register = createAction(REGISTER, (user: IdPw) => user);
export const login = createAction(LOGIN, (user: IdPw) => user);
const registerSaga = createRequestSaga(register, api.getPost);
const loginSaga = createRequestSaga(login, api.getPost);
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

const initialState: User = {
  id: '',
  pw: '',

  form: 'register',
  register: {
    id: '',
    pw: '',
  },
  auth: null,
  authError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeField: (state, action: PayloadAction<LoginOrPassword>) => {
      if (action.payload.key === 'username') state.id = action.payload.value;
      else state.pw = action.payload.value;
    },
    initialForm: (state) => {
      state.id = '';
      state.pw = '';
      state.register = {
        id: '',
        pw: '',
      };
      state.auth = null;
      state.authError = null;
    },
    REGISTER_SUCCESS: (state, action: PayloadAction<any>) => {
      state.auth = action.payload;
      state.authError = null;
    },
    REGISTER_FAILURE: (state, action: PayloadAction<any>) => {
      state.authError = action.payload.message;
      state.auth = null;
    },
  },
});

export const { changeField, initialForm } = authSlice.actions;

export default authSlice.reducer;
