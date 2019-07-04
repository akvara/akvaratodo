import { all, call, put, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import * as dotProp from 'dot-prop-immutable';

import { updateItemSaga } from '../utils/common-sagas';
import { callGet } from '../../utils/api';
import * as urlUtils from '../../utils/urlUtils';
import * as utils from '../../utils/utils.js';
import * as appActions from './app.actions';
import * as listActions from '../list/list.actions';
import {
  ListNameOnly,
  SerializedTodoList,
  TodoList,
  TodoListCopy,
  TodoListImpEx,
  TodoListMove,
  TodoListMoveByName,
} from '../types';
import { listOfListsRequestSaga } from '../list/list.sagas';
import { createAList, deleteAList, fetchAList, findListByName, updateAList } from '../../api/api';
import { dayString } from '../../utils/calendar';

/**
 * Checks if TodoList can be safely saved
 *
 * @param {SerializedTodoList} payload
 * @returns {IterableIterator<any>}
 */
function* checkAndSave({ payload }: Action<SerializedTodoList>) {
  const { listId } = payload;
  const originalList = yield fetchAList(listId);
  if (originalList.lastAction !== payload.previousAction) {
    if (payload.taskToAdd) {
      const data = {
        toListId: listId,
        task: payload.taskToAdd,
      };
      return yield put(appActions.copyToListAction(data));
    }
    return yield put(appActions.dataConflictAction(originalList.lastAction));
  }
  yield updateItemSaga(urlUtils.getAListUrl(listId), payload.listData, listActions.updateListAction);
}

/**
 * Finds list by name or creates new
 *
 * @param {ListNameOnly} payload
 * @returns id
 */
function* findOrCreateListByName({ payload }: Action<ListNameOnly>) {
  try {
    const { listName } = payload;
    const listId = yield findListByName(listName);

    if (listId) {
      return listId;
    }
    const result = yield createAList(listName);
    return result._id;
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Create or find and open list by name
 *
 * @param {ListNameOnly} payload
 * @returns {IterableIterator<any>}
 */
function* addOrOpenListsByNameSaga({ payload }: Action<ListNameOnly>) {
  try {
    const { listName } = payload;
    const listId = yield findListByName(listName);
    if (listId) {
      return yield put(listActions.getAListAction.started(listId));
    }
    const result = yield createAList(listName);
    yield put(listActions.getAListAction.started(result._id));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Creates lists for upcoming week
 *
 * @returns {IterableIterator<any>}
 */
function* planWeekSaga() {
  try {
    const listOfLists = yield call(callGet, urlUtils.getListsUrl());
    const now = new Date();
    let shiftDate = new Date();

    for (let shift = 6; shift >= 0; shift--) {
      shiftDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * shift);
      const listName = dayString(shiftDate);
      const filtered = listOfLists.filter((list: TodoList) => list.name === listName);
      if (!filtered.length) {
        yield createAList(listName);
      }
    }
    yield listOfListsRequestSaga();
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Imports list into current list
 *
 * @param {TodoListImpEx} payload
 * @returns {IterableIterator<any>}
 */
function* importListSaga({ payload }: Action<TodoListImpEx>) {
  try {
    const { fromListId, toListId } = payload;
    const first = yield fetchAList(fromListId);
    const second = yield fetchAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(first.tasks, second.tasks),
    };
    yield updateAList(toListId, data);
    yield put(listActions.getAListAction.started(toListId));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Exports list to another and deletes original
 *
 * @param {TodoListImpEx} payload
 * @returns {IterableIterator<any>}
 */
function* exportListSaga({ payload }: Action<TodoListImpEx>) {
  try {
    const { fromListId, toListId } = payload;
    const fromList = yield fetchAList(fromListId);
    const toList = yield fetchAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(fromList.tasks, toList.tasks),
    };
    yield updateAList(toListId, data);
    yield deleteAList(fromListId);
    yield put(listActions.getAListAction.started(toListId));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Moves task: copies to another and deletes from original, refreshes original
 *
 * @param {Action<TodoListMove>} action
 * @returns {IterableIterator<any>}
 */
function* moveTaskToListSaga(action: Action<TodoListMove>) {
  try {
    yield removeTaskFromList(action);
    yield prependToAList(action);
    yield put(listActions.getAListAction.started(action.payload.fromListId));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Copies task to another list, opens target list
 *
 * @param {Action<TodoListCopy>} action
 * @returns {IterableIterator<any>}
 */
function* copyTaskToListSaga(action: Action<TodoListCopy>) {
  try {
    yield prependToAList(action);
    yield put(listActions.getAListAction.started(action.payload.toListId));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Moves task to list specified by name
 *
 * @param {Action<TodoListMoveByName>} action
 * @returns {IterableIterator<any>}
 */
function* moveToListByNameSaga(action: Action<TodoListMoveByName>) {
  try {
    const listId = yield findOrCreateListByName(action);
    const newAction = dotProp.set(action, 'payload.toListId', listId);
    yield prependToAList(newAction);
    if (action.payload.move) {
      yield removeTaskFromList(newAction);
    }
    yield put(listActions.getAListAction.started(listId));
  } catch (e) {
    yield generalFailure(e);
  }
}

// *** Helpers ***
function* prependToAList({ payload }: Action<TodoListCopy>) {
  try {
    const { toListId, task } = payload;
    const originalList = yield fetchAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.prependToJSON(task, originalList.tasks),
    };
    yield updateAList(toListId, data);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* removeTaskFromList({ payload }: Action<TodoListMove>) {
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

export function* generalFailure(e: Action<{}>) {
  yield put(appActions.errorAction(e));
}

export default function* appSagas() {
  yield all([
    takeEvery(appActions.addOrOpenListByNameAction, addOrOpenListsByNameSaga),
    takeEvery(appActions.checkAndSaveAction, checkAndSave),
    takeEvery(appActions.moveToListAction, moveTaskToListSaga),
    takeEvery(appActions.copyToListAction, copyTaskToListSaga),
    takeEvery(appActions.moveToListByNameAction, moveToListByNameSaga),
    takeEvery(appActions.importListAction, importListSaga),
    takeEvery(appActions.exportListAction, exportListSaga),
    takeEvery(appActions.planWeekAction, planWeekSaga),
  ]);
}
