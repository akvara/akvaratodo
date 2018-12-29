import listSagas from './list-sagas';
import appSagas from './app-sagas';
import { all } from 'redux-saga/effects';

export default function* RootSaga() {
  yield all([
    appSagas(),
    listSagas()
  ]);
}
