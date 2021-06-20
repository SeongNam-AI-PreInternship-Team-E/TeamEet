import { combineReducers } from 'redux';
import loading from './loading';
import sample, { sampleSaga } from './sample';
import { all } from 'redux-saga/effects';
const rootReducer = combineReducers({ loading, sample });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([sampleSaga()]);
}
