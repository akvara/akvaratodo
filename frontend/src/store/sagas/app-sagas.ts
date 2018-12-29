import { all, call, put, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';

import { createItemSaga, fetchItemSaga, updateItemSaga } from './common-sagas';
import { callGet, callPost } from '../../utils/api';
import * as urlUtils from '../../utils/urlUtils';
import * as utils from '../../utils/utils.js';
import { DAYS, MONTHS } from '../../locale/lt';
import * as appActions from '../../store/actions/app-actions';
import * as listActions from '../../store/actions/list-actions';
import { ListMoveData, ListTransferData, NewTodoListEntity } from '../types';
import { getAListRequestSaga, listOfListsRequestSaga } from './list-sagas';
import { deleteAList, fetchAList, getListOfLists, updateAList } from '../../api/api';

function* checkAndSave({ payload }: Action<any>) {
  const { listId } = payload;
  const originalList = yield fetchAList(listId);
  if (originalList.lastAction !== payload.previousAction) {
    if (payload.taskToAdd) {
      const data = {
        listId: listId,
        task: payload.taskToAdd,
      };
      return yield put(appActions.copyToListAction(data));
    }
    return yield put(appActions.dataConflictAction(originalList.lastAction));
  }
  yield updateItemSaga(urlUtils.getAListUrl(listId), payload.listData, listActions.updateListAction);
}

/*
 * params: list name as action.payload.listName
 * returns listId
 */
function* findOrCreateListByName(action: Action<any>) {
  try {
    const url = urlUtils.getListsUrl();
    const listName = action.payload.listName;
    const listOfLists = yield getListOfLists();
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return filtered[0]._id;
    }
    const result = yield call(callPost, url, NewTodoListEntity(listName));
    // FixMe:
    yield fetchItemSaga(urlUtils.getListsUrl(), listActions.refreshListAction);
    return result._id;
  } catch (e) {
    yield generalFailure(e);
  }
}

function* addOrOpenListsByNameSaga(action: Action<any>) {
  try {
    const listOfLists = yield call(callGet, urlUtils.getListsUrl());
    const listName = action.payload;
    const filtered = listOfLists.filter((e) => e.name === listName);

    if (filtered.length) {
      return yield fetchItemSaga(urlUtils.getAListUrl(filtered[0]._id), listActions.getAListAction);
    }
    yield createItemSaga(urlUtils.getListsUrl(), NewTodoListEntity(listName), listActions.newListAction);
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
        yield call(callPost, urlUtils.getListsUrl(), NewTodoListEntity(listName));
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

function* importListSaga({ payload }: Action<any>) {
  try {
    const { firstListId, secondListId } = payload;
    const first = yield fetchAList(firstListId);
    const second = yield fetchAList(secondListId);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(first.tasks, second.tasks),
    };
    yield updateAList(secondListId, data);
    yield getAListRequestSaga({ payload: secondListId });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* exportListSaga({ payload }: Action<any>) {
  try {
    const { toListId, listId } = payload;
    const fromList = yield fetchAList(listId);
    const toList = yield fetchAList(toListId);
    let data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(fromList.tasks, toList.tasks),
    };
    yield updateAList(toListId, data);
    yield deleteAList(listId);
    yield getAListRequestSaga({ payload: toListId });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* moveTaskToListSaga(action: Action<any>) {
  try {
    yield removeTaskFromListSaga(action);
    yield prependToAListSaga(action);
    yield getAListRequestSaga({ payload: action.payload.fromListId });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* copyTaskToListSaga(action: Action<ListTransferData>) {
  try {
    yield prependToAListSaga(action);
    yield getAListRequestSaga({ payload: action.payload.listId });
  } catch (e) {
    yield generalFailure(e);
  }
}

function* moveToListByNameSaga(action: Action<ListTransferData>) {
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
    const { listId, task } = payload;
    const originalList = yield fetchAList(listId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.prependToJSON(task, originalList.tasks),
    };
    yield updateAList(listId, data);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* removeTaskFromListSaga({ payload }: Action<ListMoveData>) {
  try {
    const { fromListId, task } = payload;
    const originalList = yield fetchAList(fromListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.removeTask(task, originalList.tasks),
    };
    yield updateAList(fromListId, data);
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
