import { all, takeEvery } from 'redux-saga/effects';

import { fetchItemSaga, removeItemSaga } from './common-sagas';
import * as urlUtils from '../../utils/urlUtils';
import * as listActions from '../../store/actions/list-actions';
import { generalFailure } from './app-sagas';

export function* listOfListsRequestSaga() {
  yield fetchItemSaga(urlUtils.getListsUrl(), listActions.getListOfListsAction);
}

export function* getAListRequestSaga(action) {
  yield fetchItemSaga(urlUtils.getAListUrl(action.payload), listActions.getAListAction);
}

function* getAListSuccess(action) {
  if (!action.payload) {
    yield fetchItemSaga(urlUtils.getListsUrl(), listActions.getListOfListsAction);
  }
}

function* removeListRequest(action) {
  yield removeItemSaga(urlUtils.getAListUrl(action.payload), action.payload, listActions.removeListAction);
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
