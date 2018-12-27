import { all, call, put, takeEvery } from 'redux-saga/effects';

import types from '../actions/types';
import { createItemSaga, fetchItemSaga, removeItemSaga, updateItemSaga } from './common-sagas';
import { callDelete, callGet, callPost, callUpdate } from '../utils/api';
import * as UrlUtils from '../utils/urlUtils';
import * as Utils from '../utils/utils.js';
import { NewTaskEntity } from '../utils/entity';
import { DAYS, MONTHS } from '../locale/lt';

function* listOfListsRequest() {
  yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

function* checkAndSave(action) {
  const new_data = action.payload.data;
  const listId = new_data.listId;
  const originalList = yield call(callGet, UrlUtils.getAListUrl(listId));
  if (originalList.lastAction !== new_data.previousAction) {
    if (new_data.taskToAdd) {
      let payload = {
        data: {
          listId: listId,
          task: new_data.taskToAdd,
        },
      };
      return yield put({ type: types.PREPEND, payload });
    }
    return yield put({ type: types.DATA_CONFLICT, payload: originalList.lastAction });
  }
  yield updateItemSaga(UrlUtils.getAListUrl(listId), new_data.listData, types.UPDATE_LIST);
}

function* getAListRequest(action) {
  yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.GET_A_LIST);
}

function* getAListSuccess(action) {
  if (!action.payload) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
  }
}

function* removeListRequest(action) {
  yield removeItemSaga(UrlUtils.getAListUrl(action.payload.data), action.payload.data, types.REMOVE_LIST);
}

/*
 * params: list name as action.payload.data.listName
 * returns listId
 */
function* findOrCreateListByName(action) {
  try {
    const url = UrlUtils.getListsUrl();
    const listName = action.payload.data.listName;
    const listOfLists = yield call(callGet, url);
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return filtered[0]._id;
    }
    const result = yield call(callPost, url, NewTaskEntity(listName));
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.REFRESH_LIST);
    return result._id;
  } catch (e) {
    yield generalFailure(e);
  }
}

function* addOrOpenListsSaga(action) {
  try {
    const listOfLists = yield call(callGet, UrlUtils.getListsUrl());
    const listName = action.payload.data;
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return yield fetchItemSaga(UrlUtils.getAListUrl(filtered[0]._id), types.GET_A_LIST);
    }

    return yield createItemSaga(UrlUtils.getListsUrl(), NewTaskEntity(listName), types.NEW_LIST);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* planWeek() {
  try {
    const listOfLists = yield call(callGet, UrlUtils.getListsUrl());
    const now = new Date();
    let shift_date = new Date();

    for (let shift = 6; shift >= 0; shift--) {
      shift_date = new Date(now.getTime() + 1000 * 60 * 60 * 24 * shift);
      const listName = `${DAYS[shift_date.getDay()]}, ${MONTHS[shift_date.getMonth()]} ${shift_date.getDate()} d.`;
      const filtered = listOfLists.filter((e) => e.name === listName);
      if (!filtered.length) {
        yield call(callPost, UrlUtils.getListsUrl(), NewTaskEntity(listName));
      }
    }
    return yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* generalFailure(e) {
  yield put({ type: types.ERROR, payload: e });
}

function* importListSaga(action) {
  try {
    const urlFirst = UrlUtils.getAListUrl(action.payload.data.firstListId);
    const urlSecond = UrlUtils.getAListUrl(action.payload.data.secondListId);
    const firstList = yield call(callGet, urlFirst);
    const second = yield call(callGet, urlSecond);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: Utils.concatTwoJSONs(firstList.tasks, second.tasks),
    };
    yield call(callUpdate, urlSecond, data);
    return yield fetchItemSaga(urlSecond, types.GET_A_LIST);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* exportListSaga(action) {
  try {
    const urlThisList = UrlUtils.getAListUrl(action.payload.data.listId);
    const urlToThatList = UrlUtils.getAListUrl(action.payload.data.toListId);
    const thisList = yield call(callGet, urlThisList);
    const toThatList = yield call(callGet, urlToThatList);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: Utils.concatTwoJSONs(thisList.tasks, toThatList.tasks),
    };
    yield call(callUpdate, urlToThatList, data);
    yield call(callDelete, urlThisList);
    return yield fetchItemSaga(urlToThatList, types.GET_A_LIST);
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
    action.payload.data.listId = yield findOrCreateListByName(action);

    if (action.payload.data.move) {
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
    const new_data = action.payload.data;
    const url = UrlUtils.getAListUrl(new_data.listId);

    const originalList = yield call(callGet, url);

    const data = {
      lastAction: new Date().toISOString(),
      tasks: Utils.prependToJSON(new_data.task, originalList.tasks),
    };
    yield call(callUpdate, url, data);
    return yield fetchItemSaga(url, types.GET_A_LIST);
  } catch (e) {
    yield generalFailure(e);
  }
}

/* Expects: {fromListId, task} */
function* removeTaskFromListSaga(action) {
  try {
    const new_data = action.payload.data;
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
    takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
    takeEvery(types.LIST_OF_LISTS.FAILURE, generalFailure),

    takeEvery(types.GET_A_LIST.REQUEST, getAListRequest),
    takeEvery(types.GET_A_LIST.SUCCESS, getAListSuccess),
    takeEvery(types.GET_A_LIST.FAILURE, generalFailure),

    takeEvery(types.REMOVE_LIST.REQUEST, removeListRequest),
    takeEvery(types.REMOVE_LIST.SUCCESS, listOfListsRequest),
    takeEvery(types.REMOVE_LIST.FAILURE, generalFailure),

    takeEvery(types.NEW_LIST.SUCCESS, getAListRequest),
    takeEvery(types.NEW_LIST.FAILURE, generalFailure),

    takeEvery(types.UPDATE_LIST.FAILURE, generalFailure),

    takeEvery(types.ADD_OR_OPEN_LIST, addOrOpenListsSaga),
    takeEvery(types.CHECK_AND_SAVE, checkAndSave),
    takeEvery(types.PREPEND, prependToAListSaga),
    takeEvery(types.MOVE_TO, moveTaskToAnotherListSaga),
    takeEvery(types.COPY_OR_MOVE, copyOrMoveToNewListSaga),
    takeEvery(types.IMPORT_LIST, importListSaga),
    takeEvery(types.EXPORT_LIST, exportListSaga),
    takeEvery(types.PLAN_WEEK, planWeek),
  ]);
}
