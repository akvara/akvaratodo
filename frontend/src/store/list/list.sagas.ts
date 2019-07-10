import { all, call, put, takeEvery } from 'redux-saga/effects';

import { generalFailure } from '../app/app.sagas';
import api from '../../core/api';
import { getAList, getListOfLists, newListAction } from './list.actions';
import * as statusActions from '../status/status.actions';
import { statusMessages } from '../../config/constants';

export function* getListOfListsSaga() {
  yield put(statusActions.setStatusMessage(statusMessages.msgLoadingLists));
  const result = yield call(api.lists.apiGetListOfList);
  yield put(getListOfLists.done(result));
  yield put(statusActions.setStatusMessage(statusMessages.msgListsLoaded));
}

export function* getAListSaga({ payload }: ReturnType<typeof getAList.started>) {
  yield put(statusActions.setStatusMessage(statusMessages.msgLoadingAList));
  const result = yield call(api.lists.apiGetAList, payload);
  yield put(getAList.done(result));
  yield put(statusActions.setStatusMessage(`${result.name}${statusMessages.msgLoaded}`));
}

export default function* listSagas() {
  yield all([
    takeEvery(getListOfLists.started, getListOfListsSaga),
    takeEvery(getAList.started, getAListSaga),
    takeEvery(newListAction.failed, generalFailure),
  ]);
}
