import { combineReducers } from 'redux';
import loading from './loading';
import sample, { sampleSaga } from './sample';
import calendar from './calendar';
import { all } from 'redux-saga/effects';
import user, { userSaga } from './user';
import auth, { authSaga } from './auth';
import timetable from './timetable';
import time from './time';
import individual from './individual';
const rootReducer = combineReducers({
  loading,
  sample,
  calendar,
  user,
  auth,
  time,
  timetable,
  individual,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([sampleSaga(), userSaga(), authSaga()]);
}
