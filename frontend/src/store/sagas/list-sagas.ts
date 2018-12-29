import { all, takeEvery } from 'redux-saga/effects';

import { fetchItemSaga, removeItemSaga } from './common-sagas';
import * as urlUtils from '../../utils/urlUtils';
import * as listActions from '../../store/actions/list-actions';
import { generalFailure } from './app-sagas';
import { Action } from 'typescript-fsa';

export function* listOfListsRequestSaga() {
  yield fetchItemSaga(urlUtils.getListsUrl(), listActions.getListOfListsAction);
}

export function* getAListRequestSaga({ payload }: Action<any>) {
  yield fetchItemSaga(urlUtils.getAListUrl(payload), listActions.getAListAction);
}

function* getAListSuccess(action: Action<any>) {
  if (!action.payload) {
    yield fetchItemSaga(urlUtils.getListsUrl(), listActions.getListOfListsAction);
  }
}

function* removeListRequest({ payload }: Action<any>) {
  yield removeItemSaga(urlUtils.getAListUrl(payload), payload, listActions.removeListAction);
}

export default function* listSagas() {
  yield all([
    takeEvery(listActions.getListOfListsAction.started, listOfListsRequestSaga),
    takeEvery(listActions.getListOfListsAction.failed, generalFailure),

    takeEvery(listActions.getAListAction.started, getAListRequestSaga),
    takeEvery(listActions.getAListAction.done, getAListSuccess),
    takeEvery(listActions.getAListAction.failed, generalFailure),

    takeEvery(listActions.removeListAction.started, removeListRequest),
    takeEvery(listActions.removeListAction.done, listOfListsRequestSaga),
    takeEvery(listActions.removeListAction.failed, generalFailure),

    takeEvery(listActions.newListAction.done, getAListRequestSaga),
    takeEvery(listActions.newListAction.failed, generalFailure),

    takeEvery(listActions.updateListAction.failed, generalFailure),
  ]);
}
