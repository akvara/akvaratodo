import { all } from 'redux-saga/effects';

import listSagas from './list/list.sagas';
import appSagas from './app/app.sagas';

export default function* RootSaga() {
  yield all([
    appSagas(),
    listSagas()
  ]);
}
