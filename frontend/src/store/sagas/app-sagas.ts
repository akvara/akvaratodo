import { all, call, put, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';

import { createItemSaga, fetchItemSaga, updateItemSaga } from './common-sagas';
import { callDelete, callGet, callPost, callUpdate } from '../../utils/api';
import * as urlUtils from '../../utils/urlUtils';
import * as utils from '../../utils/utils.js';
import { NewTaskEntity } from '../../utils/entity';
import { DAYS, MONTHS } from '../../locale/lt';
import * as appActions from '../../store/actions/app-actions';
import * as listActions from '../../store/actions/list-actions';
import { ListMoveData, ListTransferData } from '../types';
import { getAListRequestSaga, listOfListsRequestSaga } from './list-sagas';

function* checkAndSave(action) {
  const new_data = action.payload;
  const listId = new_data.listId;
  const originalList = yield call(callGet, urlUtils.getAListUrl(listId));
  if (originalList.lastAction !== new_data.previousAction) {
    if (new_data.taskToAdd) {
      const payload = {
        listId: listId,
        task: new_data.taskToAdd,
      };
      return yield put(appActions.copyToListAction(payload));
    }
    return yield put(appActions.dataConflictAction(originalList.lastAction));
  }
  yield updateItemSaga(urlUtils.getAListUrl(listId), new_data.listData, listActions.updateListAction);
}

/*
 * params: list name as action.payload.listName
 * returns listId
 */
function* findOrCreateListByName(action) {
  try {
    const url = urlUtils.getListsUrl();
    const listName = action.payload.listName;
    const listOfLists = yield call(callGet, url);
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return filtered[0]._id;
    }
    const result = yield call(callPost, url, NewTaskEntity(listName));
    // FixMe:     yield getAListRequestSaga(action);
    yield fetchItemSaga(urlUtils.getListsUrl(), listActions.refreshListAction);
    return result._id;
  } catch (e) {
    yield generalFailure(e);
  }
}

function* addOrOpenListsByNameSaga(action) {
  try {
    const listOfLists = yield call(callGet, urlUtils.getListsUrl());
    const listName = action.payload;
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return yield fetchItemSaga(urlUtils.getAListUrl(filtered[0]._id), listActions.getAListAction);
    }
    yield createItemSaga(urlUtils.getListsUrl(), NewTaskEntity(listName), listActions.newListAction);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* planWeekSaga() {
  try {
    const listOfLists = yield call(callGet, urlUtils.getListsUrl());
    const now = new Date();
    let shift_date = new Date();

    for (let shift = 6; shift >= 0; shift--) {
      shift_date = new Date(now.getTime() + 1000 * 60 * 60 * 24 * shift);
      const listName = `${DAYS[shift_date.getDay()]}, ${MONTHS[shift_date.getMonth()]} ${shift_date.getDate()} d.`;
      const filtered = listOfLists.filter((e) => e.name === listName);
      if (!filtered.length) {
        yield call(callPost, urlUtils.getListsUrl(), NewTaskEntity(listName));
      }
    }
    yield listOfListsRequestSaga();
  } catch (e) {
    yield generalFailure(e);
  }
}

export function* generalFailure(e) {
  yield put(appActions.errorAction(e));
}

function* importListSaga(action) {
  try {
    const idFirst = urlUtils.getAListUrl(action.payload.firstListId);
    const idSecond = urlUtils.getAListUrl(action.payload.secondListId);
    const firstList = yield call(callGet, idFirst);
    const second = yield call(callGet, idSecond);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(firstList.tasks, second.tasks),
    };
    yield call(callUpdate, idSecond, data);
    yield getAListRequestSaga({ payload: idSecond });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* exportListSaga(action) {
  try {
    const urlThisList = urlUtils.getAListUrl(action.payload.listId);
    const urlToThatList = urlUtils.getAListUrl(action.payload.toListId);
    const thisList = yield call(callGet, urlThisList);
    const toThatList = yield call(callGet, urlToThatList);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(thisList.tasks, toThatList.tasks),
    };
    yield call(callUpdate, urlToThatList, data);
    yield call(callDelete, urlThisList);
    yield getAListRequestSaga({ payload: urlToThatList });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* moveTaskToListSaga(action) {
  try {
    yield removeTaskFromListSaga(action);
    yield prependToAListSaga(action);
    yield getAListRequestSaga({ payload: action.payload.fromListId });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* copyTaskToListSaga(action) {
  try {
    yield prependToAListSaga(action);
    yield getAListRequestSaga({ payload: action.payload.listId });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* moveToListByNameSaga(action) {
  try {
    action.payload.listId = yield findOrCreateListByName(action);

    yield prependToAListSaga(action);
    if (action.payload.move) {
      yield removeTaskFromListSaga(action);
    }
    yield getAListRequestSaga({ payload: action.payload.listId });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* prependToAListSaga({ payload }: Action<ListTransferData>) {
  try {
    const new_data = payload;
    const url = urlUtils.getAListUrl(new_data.listId);

    const originalList = yield call(callGet, url);

    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.prependToJSON(new_data.task, originalList.tasks),
    };
    yield call(callUpdate, url, data);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* removeTaskFromListSaga({ payload }: Action<ListMoveData>) {
  try {
    const new_data = payload;
    const url = urlUtils.getAListUrl(new_data.fromListId);

    const originalList = yield call(callGet, url);

    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.removeTask(new_data.task, originalList.tasks),
    };
    yield call(callUpdate, url, data);
  } catch (e) {
    yield generalFailure(e);
  }
}

export default function* appSagas() {
  yield all([
    takeEvery(appActions.addOrOpenListByNameAction, addOrOpenListsByNameSaga),
    takeEvery(appActions.checkAndSaveAction, checkAndSave),
    takeEvery(appActions.copyToListAction, copyTaskToListSaga),
    takeEvery(appActions.moveToListAction, moveTaskToListSaga),
    takeEvery(appActions.moveToListByNameAction, moveToListByNameSaga),
    takeEvery(appActions.importListAction, importListSaga),
    takeEvery(appActions.exportListAction, exportListSaga),
    takeEvery(appActions.planWeekAction, planWeekSaga),
  ]);
}
