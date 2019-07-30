import { all, put, select, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import * as dotProp from 'dot-prop-immutable';

import * as utils from '../../utils/utils.js';
import {
  ListNameOnly,
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
import { findOrCreateListByNameHelperSaga, getAListSagaHelper, getListOfListsSagaHelper } from '../list/list.sagas';
import { getPreviousDays } from '../../utils/stringUtils';
import { apiCreateAList, apiDeleteAList, apiGetAList, apiGetListOfLists, apiUpdateAList } from '../../core/api/utils';

/**
 * Check if TodoList can be safely saved, and update
 */
function* checkAndSave({ payload }: Action<SerializedTodoList>) {
  const { listId, listData, previousAction, taskToAdd } = payload;
  yield put(statusActions.setStatusMessage(statusMessages.msgChecking));
  const originalList = yield apiGetAList(listId);
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
  yield put(statusActions.setStatusMessage(statusMessages.msgSaved));
  yield apiUpdateAList(listId, listData);
}

/**
 * Create / open list by name
 */
function* addOrOpenListsByNameSaga({ payload: { listName } }: Action<ListNameOnly>) {
  try {
    yield put(appActions.setMode(appModes.MODE_LOADING));
    yield put(statusActions.setStatusMessage(statusMessages.msgLoadingLists));
    const listId = yield findOrCreateListByNameHelperSaga(listName);
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
    const first = yield apiGetAList(fromListId);
    const second = yield apiGetAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(first.tasks, second.tasks),
    };
    yield apiUpdateAList(toListId, data);
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
    const fromList = yield apiGetAList(fromListId);
    const toList = yield apiGetAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.concatTwoJSONs(fromList.tasks, toList.tasks),
    };
    yield apiUpdateAList(toListId, data);
    yield apiDeleteAList(fromListId);
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
    const listId = yield findOrCreateListByNameHelperSaga(action.payload.listName);
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
    const originalList = yield apiGetAList(toListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.prependToJSON(task, originalList.tasks),
    };
    yield apiUpdateAList(toListId, data);
  } catch (e) {
    yield generalFailure(e);
  }
}

function* removeTaskFromList({ payload }: Action<TodoListMove>) {
  try {
    const { fromListId, task } = payload;
    const originalList = yield apiGetAList(fromListId);
    const data = {
      lastAction: new Date().toISOString(),
      tasks: utils.removeTask(task, originalList.tasks),
    };
    yield apiUpdateAList(fromListId, data);
  } catch (e) {
    yield generalFailure(e);
  }
}

// New, correct from here
/**
 * Load lists and go to main ListOfLists page
 */
function* startupSaga() {
  try {
    yield put(appActions.setMode(appModes.MODE_LOADING));
    yield put(statusActions.setStatusMessage(statusMessages.msgLoadingLists));
    yield getListOfListsSagaHelper();
    yield put(appActions.setMode(appModes.MODE_LIST_OF_LISTS));
    yield put(statusActions.setStatusMessage(statusMessages.msgListsLoaded));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Reload ListOfLists page
 */
function* reloadListOfListsSaga() {
  try {
    const currentMode = yield select(appSelector.selectCurrentMode);
    const currentMsg = yield select(statusSelector.getCurrentMessage);

    yield put(appActions.setMode(appModes.MODE_LOADING));
    yield put(statusActions.setStatusMessage(statusMessages.msgLoadingLists));

    yield getListOfListsSagaHelper();

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
    const listOfLists = yield apiGetListOfLists();
    // Save received list
    yield put(listActions.getListOfLists.done(listOfLists));
    // Find/create today's list
    const todayListName = dayString(new Date());
    let todayList = listOfLists.find((list: TodoList) => list.name === todayListName);
    if (!todayList) {
      yield put(statusActions.setStatusMessage(`statusMessages.msgCreatingAList${todayListName}`));
      todayList = yield apiCreateAList(todayListName);
      yield getListOfListsSagaHelper();
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
      yield apiUpdateAList(todayList._id, todayList);
      yield put(statusActions.setStatusMessage(statusMessages.msgDeletingAList));
      yield all(legacyListIds.map((listId) => apiDeleteAList(listId)));
      yield getListOfListsSagaHelper();
    }
    yield put(listActions.getAList.done(todayList)); // ToDo: get rid of
    yield put(selectedActions.setSelectedList(todayList._id));
    yield put(statusActions.setStatusMessage(statusMessages.msgTodaysLoaded));
    yield put(appActions.setMode(appModes.MODE_A_LIST));
  } catch (e) {
    yield generalFailure(e);
  }
}

// ToDo: check why ListOfLists is not refreshed without mode change
function* deleteAListSaga({ payload }: ReturnType<typeof appActions.deleteAList>) {
  yield put(appActions.setMode(appModes.MODE_LOADING));
  yield put(statusActions.setStatusMessage(statusMessages.msgDeletingAList));
  yield apiDeleteAList(payload);
  yield getListOfListsSagaHelper();
  yield put(statusActions.setStatusMessage(statusMessages.msgListDeleted));
  yield put(appActions.setMode(appModes.MODE_LIST_OF_LISTS));
}

/**
 * Creates lists for upcoming week
 */
function* planWeekSaga() {
  yield put(statusActions.setStatusMessage(statusMessages.msgPlanAWeek));
  yield put(appActions.setMode(appModes.MODE_LOADING));
  try {
    // Refresh list
    const listOfLists = yield apiGetListOfLists();
    const now = new Date();
    let shiftDate = new Date();

    for (let shift = 6; shift >= 0; shift--) {
      shiftDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * shift);
      const listName = dayString(shiftDate);
      if (!listOfLists.find((list: TodoList) => list.name === listName)) {
        yield apiCreateAList(listName);
      }
    }
    yield getListOfListsSagaHelper();
    yield put(statusActions.setStatusMessage(statusMessages.msgWeekPlanned));
    yield put(appActions.setMode(appModes.MODE_LIST_OF_LISTS));
  } catch (e) {
    yield generalFailure(e);
  }
}

/**
 * Load and open page with a ToDoList
 */

function* openAListByIdSaga({ payload }: ReturnType<typeof appActions.openAList>) {
  try {
    yield put(statusActions.setStatusMessage(statusMessages.msgLoadingAList));
    yield put(appActions.setMode(appModes.MODE_LOADING));
    const listName = yield getAListSagaHelper(payload);
    yield put(appActions.setMode(appModes.MODE_A_LIST));
    yield put(statusActions.setStatusMessage(`${listName}${statusMessages.msgLoaded}`));
  } catch (e) {
    yield generalFailure(e);
  }
}
/**
 * Reload a list
 */

function* reloadAListSaga({ payload }: ReturnType<typeof appActions.reloadAList>) {
  try {
    yield put(statusActions.setStatusMessage(statusMessages.msgLoadingAList));
    yield put(appActions.setMode(appModes.MODE_LOADING));

    const listName = yield getAListSagaHelper(payload);
    if (listName) {
      yield put(appActions.setMode(appModes.MODE_A_LIST));
      yield put(statusActions.setStatusMessage(`${listName}${statusMessages.msgLoaded}`));
      return
    }
    yield getListOfListsSagaHelper();
    yield put(statusActions.setStatusMessage(statusMessages.msgListsLoaded));
    yield put(appActions.setMode(appModes.MODE_LIST_OF_LISTS));

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
    takeEvery(appActions.reloadAList, reloadAListSaga),
    takeEvery(appActions.collectPastDays, collectPastDaysSaga),
    takeEvery(appActions.deleteAList, deleteAListSaga),
    // takeEvery(appActions.moveInitiationAction, moveInitiationActionSaga),
  ]);
}
