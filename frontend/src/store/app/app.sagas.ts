import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import * as dotProp from 'dot-prop-immutable';

import api from '../../core/api';
import { callGet } from '../../utils/api';
import * as utils from '../../utils/utils.js';
import {
  ListNameOnly,
  NewTodoListEntity,
  SerializedTodoList,
  TodoList,
  TodoListCopy,
  TodoListImpEx,
  TodoListMove,
  TodoListMoveByName,
} from '../types';
import { dayString } from '../../utils/calendar';
import { appSelector, statusSelector } from '../selectors';
import { appModes, statusMessages } from '../../config/constants';
import { appActions, listActions, selectedActions, statusActions } from '../actions';
import { getAListSaga, getListOfListsSaga } from '../list/list.sagas';
import { getPreviousDays } from '../../utils/stringUtils';

/**
 * Checks if TodoList can be safely saved
 *
 * @param {SerializedTodoList} payload
 * @returns {IterableIterator<any>}
 */
function* checkAndSave({ payload }: Action<SerializedTodoList>) {
  const { listId, listData, previousAction, taskToAdd } = payload;
  yield put(statusActions.setStatusMessage(statusMessages.msgChecking));
  const originalList = yield api.lists.apiGetAList(listId);
  if (originalList.lastAction !== previousAction) {
    if (taskToAdd) {
      yield put(statusActions.setStatusMessage(statusMessages.msgAdding));
      const data = {
        toListId: listId,
        task: taskToAdd,
      };
      // yield copyTaskToListSaga({ payload: data, type: '' });
      yield put(appActions.copyToListAction(data));
      // yield put(statusActions.setStatusMessage(statusMessages.msgAddedAndRefreshed));
      return;
    }
    yield put(statusActions.setStatusMessage(statusMessages.msgDataConflict));
    yield put(appActions.dataConflictAction(originalList.lastAction));
    return;
  }
  yield put(statusActions.setStatusMessage(statusMessages.msgAdded));
  yield call(api.lists.apiUpdateAList, { _id: listId, ...listData } as TodoList);
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
    const listOfLists = yield call(api.lists.apiGetListOfList);
    const found = listOfLists.find((list: TodoList) => list.name === listName);
    if (found) {
      return found._id;
    }
    const newList = yield call(api.lists.apiCreateAList, NewTodoListEntity(listName));
    return newList._id;
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
    const listId = yield findOrCreateListByName({ payload: { listName }, type: '' });
    yield put(appActions.openAList(listId));
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
    const first = yield api.lists.apiGetAList(fromListId);
    const second = yield api.lists.apiGetAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(first.tasks, second.tasks),
    };
    yield call(api.lists.apiUpdateAList, { _id: toListId, ...data } as TodoList);
    yield put(appActions.openAList(toListId));
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
    const fromList = yield api.lists.apiGetAList(fromListId);
    const toList = yield api.lists.apiGetAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(fromList.tasks, toList.tasks),
    };
    yield api.lists.apiUpdateAList({ _id: toListId, ...data } as TodoList);
    yield api.lists.apiDeleteAList(fromListId);
    yield put(appActions.openAList(toListId));
    yield put(statusActions.setStatusMessage(statusMessages.msgExported));
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
    yield put(appActions.openAList(action.payload.fromListId));
    yield put(statusActions.setStatusMessage(statusMessages.msgMoved));
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
    yield put(appActions.openAList(action.payload.toListId));
    yield put(statusActions.setStatusMessage(statusMessages.msgCopied));
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
    yield put(appActions.openAList(listId));
    yield put(appActions.setMode(appModes.MODE_A_LIST));
    yield put(statusActions.setStatusMessage(statusMessages.msgMoved));
  } catch (e) {
    yield generalFailure(e);
  }
}

// *** Helpers ***
function* prependToAList({ payload }: Action<TodoListCopy>) {
  try {
    const { toListId, task } = payload;
    const originalList = yield api.lists.apiGetAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.prependToJSON(task, originalList.tasks),
    };
    yield api.lists.apiUpdateAList({ _id: toListId, ...data } as TodoList);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* removeTaskFromList({ payload }: Action<TodoListMove>) {
  try {
    const { fromListId, task } = payload;
    const originalList = yield api.lists.apiGetAList(fromListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.removeTask(task, originalList.tasks),
    };
    yield api.lists.apiUpdateAList({ _id: fromListId, ...data } as TodoList);
  } catch (e) {
    yield generalFailure(e);
  }
}

// New, correct from here
/**
 * Called on startup
 */
function* startupSaga() {
  try {
    yield put(appActions.setMode(appModes.MODE_LOADING));
    yield getListOfListsSaga();
    yield put(appActions.setMode(appModes.MODE_LIST_OF_LISTS));
  } catch (e) {
    yield generalFailure(e);
  }
}
/**
 * Reloads ListOfLists data
 */
function* reloadListOfListsSaga() {
  try {
    const currentMode = yield select(appSelector.selectCurrentMode);
    const currentMsg = yield select(statusSelector.getCurrentMessage);

    yield put(appActions.setMode(appModes.MODE_LOADING));
    yield put(statusActions.setStatusMessage(statusMessages.msgLoadingLists));

    yield getListOfListsSaga();

    yield put(appActions.setMode(currentMode));
    yield put(statusActions.setStatusMessage(currentMsg));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Collects previous days todos into Today
 * Creates Today in not present
 */
function* collectPastDaysSaga() {
  try {
    // Set messages
    yield put(appActions.setMode(appModes.MODE_LOADING));
    yield put(statusActions.setStatusMessage(statusMessages.msgLoadingLists));

    // Refresh list
    const listOfLists = yield call(api.lists.apiGetListOfList);
    // Save received list
    yield put(listActions.getListOfLists.done(listOfLists));
    // Find/create today's list
    const todayListName = dayString(new Date());
    let todayList = listOfLists.find((list: TodoList) => list.name === todayListName);
    if (!todayList) {
      yield put(statusActions.setStatusMessage(`statusMessages.msgCreatingAList${todayListName}`));
      todayList = yield call(api.lists.apiCreateAList, NewTodoListEntity(todayListName));
      yield getListOfListsSaga();
    }

    // Collect legacy ToDos
    let prevDayList;
    const legacyListIds: string[] = [];
    let collectedTasks = todayList.tasks;
    getPreviousDays().forEach((prevDayString) => {
      // prevDayString = dayString(new Date(Date.now() - secsPerDay * before));
      prevDayList = listOfLists.find((list: TodoList) => list.name === prevDayString);
      if (prevDayList) {
        legacyListIds.push(prevDayList._id as string);
        collectedTasks = utils.concatTwoJSONs(prevDayList.tasks, collectedTasks);
      }
    });

    // Update Today and delete legacy lists
    if (legacyListIds.length) {
      todayList = {
        ...todayList,
        lastAction: new Date().toISOString(),
        tasks: collectedTasks,
      } as TodoList;
      yield call(api.lists.apiUpdateAList, todayList);
      yield put(statusActions.setStatusMessage(statusMessages.msgDeletingAList));
      yield all(legacyListIds.map((listId) => call(api.lists.apiDeleteAList, listId)));
      yield getListOfListsSaga();
    }
    yield put(listActions.getAList.done(todayList)); // ToDo: get rid of
    yield put(selectedActions.setSelectedList(todayList._id));
    yield put(statusActions.setStatusMessage(statusMessages.msgTodaysLoaded));
    yield put(appActions.setMode(appModes.MODE_A_LIST));
  } catch (e) {
    yield generalFailure(e);
  }
}

function* deleteAListSaga({ payload }: ReturnType<typeof appActions.deleteAList>) {
  yield put(appActions.setMode(appModes.MODE_LOADING));
  yield put(statusActions.setStatusMessage(statusMessages.msgDeletingAList));
  yield call(api.lists.apiDeleteAList, payload);
  yield getListOfListsSaga();
  yield put(statusActions.setStatusMessage(statusMessages.msgListDeleted));
  yield put(appActions.setMode(appModes.MODE_LIST_OF_LISTS));
}

/**
 * Creates lists for upcoming week
 *
 * @returns {IterableIterator<any>}
 */
function* planWeekSaga() {
  yield put(statusActions.setStatusMessage(statusMessages.msgPlanAWeek));
  yield put(appActions.setMode(appModes.MODE_LOADING));
  try {
    // Refresh list
    const listOfLists = yield call(api.lists.apiGetListOfList);
    const now = new Date();
    let shiftDate = new Date();

    for (let shift = 6; shift >= 0; shift--) {
      shiftDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * shift);
      const listName = dayString(shiftDate);
      if (!listOfLists.find((list: TodoList) => list.name === listName)) {
        yield call(api.lists.apiCreateAList, NewTodoListEntity(listName));
      }
    }
    yield getListOfListsSaga();
    // ToDo: check kodėl neveikia
    // yield put(listActions.getListOfLists);
    yield put(statusActions.setStatusMessage(statusMessages.msgWeekPlanned));
    yield put(appActions.setMode(appModes.MODE_LIST_OF_LISTS));
  } catch (e) {
    yield generalFailure(e);
  }
}

function* openAListByIdSaga({ payload }: ReturnType<typeof appActions.openAList>) {
  try {
    yield put(appActions.setMode(appModes.MODE_LOADING));
    yield getAListSaga({ payload, type: '' });
    yield put(appActions.setMode(appModes.MODE_A_LIST));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Fires Error action
 * @param e Error
 */
export function* generalFailure(e: Action<{}>) {
  console.error(e);
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
    // New from here
    // takeEvery(appActions.openAList, openAListSaga),
    takeEvery(appActions.startup, startupSaga),
    takeEvery(appActions.openAList, openAListByIdSaga),
    takeEvery(appActions.reloadListOfLists, reloadListOfListsSaga),
    takeEvery(appActions.collectPastDays, collectPastDaysSaga),
    takeEvery(appActions.deleteAList, deleteAListSaga),
    // takeEvery(appActions.moveInitiationAction, moveInitiationActionSaga),
  ]);
}
