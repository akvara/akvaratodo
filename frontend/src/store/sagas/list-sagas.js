import { all, call, put, takeEvery } from 'redux-saga/effects';

import { createItemSaga, fetchItemSaga, removeItemSaga, updateItemSaga } from './common-sagas';
import { callDelete, callGet, callPost, callUpdate } from '../../utils/api';
import * as UrlUtils from '../../utils/urlUtils';
import * as Utils from '../../utils/utils.js';
import { NewTaskEntity } from '../../utils/entity';
import { DAYS, MONTHS } from '../../locale/lt';
import * as listActions from '../../store/actions/list-actions';
import * as appActions from '../../store/actions/app-actions';

function* listOfListsRequest() {
  yield fetchItemSaga(UrlUtils.getListsUrl(), listActions.getListOfListsAction);
}

function* checkAndSave(action) {
  const new_data = action.payload;
  const listId = new_data.listId;
  const originalList = yield call(callGet, UrlUtils.getAListUrl(listId));
  if (originalList.lastAction !== new_data.previousAction) {
    if (new_data.taskToAdd) {
      const payload = {
          listId: listId,
          task: new_data.taskToAdd,
      };
      return yield put(prependToAListAction(payload));
    }
    return yield put(dataConflictAction(originalList.lastAction));
  }
  yield updateItemSaga(UrlUtils.getAListUrl(listId), new_data.listData, listActions.updateListAction);
}

function* getAListRequest(action) {
  yield fetchItemSaga(UrlUtils.getAListUrl(action.payload), listActions.getAListAction);
}

function* getAListSuccess(action) {
  if (!action.payload) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), listActions.getListOfListsAction);
  }
}

function* removeListRequest(action) {
  yield removeItemSaga(UrlUtils.getAListUrl(action.payload), action.payload, listActions.removeListAction);
}

/*
 * params: list name as action.payload.listName
 * returns listId
 */
function* findOrCreateListByName(action) {
  try {
    const url = UrlUtils.getListsUrl();
    const listName = action.payload.listName;
    const listOfLists = yield call(callGet, url);
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return filtered[ 0 ]._id;
    }
    const result = yield call(callPost, url, NewTaskEntity(listName));
    yield fetchItemSaga(UrlUtils.getListsUrl(), listActions.refreshListAction);
    return result._id;
  } catch (e) {
    yield generalFailure(e);
  }
}

function* addOrOpenListsSaga(action) {
  try {
    const listOfLists = yield call(callGet, UrlUtils.getListsUrl());
    const listName = action.payload;
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return yield fetchItemSaga(UrlUtils.getAListUrl(filtered[ 0 ]._id), listActions.getAListAction);
    }

    return yield createItemSaga(UrlUtils.getListsUrl(), NewTaskEntity(listName), listActions.newListAction);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* planWeekSaga() {
  try {
    const listOfLists = yield call(callGet, UrlUtils.getListsUrl());
    const now = new Date();
    let shift_date = new Date();

    for (let shift = 6; shift >= 0; shift--) {
      shift_date = new Date(now.getTime() + 1000 * 60 * 60 * 24 * shift);
      const listName = `${DAYS[ shift_date.getDay() ]}, ${MONTHS[ shift_date.getMonth() ]} ${shift_date.getDate()} d.`;
      const filtered = listOfLists.filter((e) => e.name === listName);
      if (!filtered.length) {
        yield call(callPost, UrlUtils.getListsUrl(), NewTaskEntity(listName));
      }
    }
    return yield fetchItemSaga(UrlUtils.getListsUrl(), listActions.getListOfListsAction);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* generalFailure(e) {
  yield put({ type: errorAction, payload: e });
}

function* importListSaga(action) {
  try {
    const urlFirst = UrlUtils.getAListUrl(action.payload.firstListId);
    const urlSecond = UrlUtils.getAListUrl(action.payload.secondListId);
    const firstList = yield call(callGet, urlFirst);
    const second = yield call(callGet, urlSecond);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: Utils.concatTwoJSONs(firstList.tasks, second.tasks),
    };
    yield call(callUpdate, urlSecond, data);
    return yield fetchItemSaga(urlSecond, listActions.getAListAction);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* exportListSaga(action) {
  try {
    const urlThisList = UrlUtils.getAListUrl(action.payload.listId);
    const urlToThatList = UrlUtils.getAListUrl(action.payload.toListId);
    const thisList = yield call(callGet, urlThisList);
    const toThatList = yield call(callGet, urlToThatList);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: Utils.concatTwoJSONs(thisList.tasks, toThatList.tasks),
    };
    yield call(callUpdate, urlToThatList, data);
    yield call(callDelete, urlThisList);
    return yield fetchItemSaga(urlToThatList, listActions.getAListAction);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* moveTaskToAnotherListSaga(action) {
  try {
    yield removeTaskFromListSaga(action);
    yield prependToAListSaga(action);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* copyOrMoveToNewListSaga(action) {
  try {
    action.payload.listId = yield findOrCreateListByName(action);

    if (action.payload.move) {
      yield removeTaskFromListSaga(action);
    }
    yield prependToAListSaga(action);
  } catch (e) {
    yield generalFailure(e);
  }
}

/* Expects: {listId, task} */
function* prependToAListSaga(action) {
  try {
    const new_data = action.payload;
    const url = UrlUtils.getAListUrl(new_data.listId);

    const originalList = yield call(callGet, url);

    const data = {
      lastAction: new Date().toISOString(),
      tasks: Utils.prependToJSON(new_data.task, originalList.tasks),
    };
    yield call(callUpdate, url, data);
    return yield fetchItemSaga(url, listActions.getAListAction);
  } catch (e) {
    yield generalFailure(e);
  }
}

/* Expects: {fromListId, task} */
function* removeTaskFromListSaga(action) {
  try {
    const new_data = action.payload;
    const url = UrlUtils.getAListUrl(new_data.fromListId);

    const originalList = yield call(callGet, url);

    const data = {
      lastAction: new Date().toISOString(),
      tasks: Utils.removeTask(new_data.task, originalList.tasks),
    };
    yield call(callUpdate, url, data);
  } catch (e) {
    yield generalFailure(e);
  }
}

export default function* listSagas() {
  yield all([
    takeEvery(listActions.getListOfListsAction.started, listOfListsRequest),
    takeEvery(listActions.getListOfListsAction.failed, generalFailure),

    takeEvery(listActions.getAListAction.started, getAListRequest),
    takeEvery(listActions.getAListAction.done, getAListSuccess),
    takeEvery(listActions.getAListAction.failed, generalFailure),

    takeEvery(listActions.removeListAction.started, removeListRequest),
    takeEvery(listActions.removeListAction.done, listOfListsRequest),
    takeEvery(listActions.removeListAction.failed, generalFailure),

    takeEvery(listActions.newListAction.done, getAListRequest),
    takeEvery(listActions.newListAction.failed, generalFailure),

    takeEvery(listActions.updateListAction.failed, generalFailure),

    takeEvery(appActions.addOrOpenListAction, addOrOpenListsSaga),
    takeEvery(appActions.checkAndSaveAction, checkAndSave),
    takeEvery(appActions.prependToAListAction, prependToAListSaga),
    takeEvery(appActions.moveToListAction, moveTaskToAnotherListSaga),
    takeEvery(appActions.copyOrMoveToNewListAction, copyOrMoveToNewListSaga),
    takeEvery(appActions.importListAction, importListSaga),
    takeEvery(appActions.exportListAction, exportListSaga),
    takeEvery(appActions.planWeekAction, planWeekSaga),
  ]);
}
