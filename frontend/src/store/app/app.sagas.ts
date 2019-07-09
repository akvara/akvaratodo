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
import { fetchAList, findListByName, updateAList } from '../../api/api';
import { dayString } from '../../utils/calendar';
import { appSelector, statusSelector } from '../selectors';
import { appModes, restrictions, secsPerDay, statusMessages } from '../../config/constants';
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
  const originalList = yield fetchAList(listId);
  if (originalList.lastAction !== previousAction) {
    if (taskToAdd) {
      yield put(statusActions.setStatusMessage(statusMessages.msgAdding));
      const data = {
        toListId: listId,
        task: taskToAdd,
      };
      yield copyTaskToListSaga({ payload: data, type: '' });
      // yield put(appActions.copyToListAction(data));
      yield put(statusActions.setStatusMessage(statusMessages.msgAddedAndRefreshed));
      return;
    }
    yield put(statusActions.setStatusMessage(statusMessages.msgDataConflict));
    yield put(appActions.dataConflictAction(originalList.lastAction));
    return;
  }
  yield put(statusActions.setStatusMessage(statusMessages.msgAdded));
  yield call(api.lists.editAList, { _id: listId, ...listData } as TodoList);
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
    const result = yield call(api.lists.addAList, NewTodoListEntity(listName));
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

    let listId = yield findListByName(listName);
    if (!listId) {
      listId = yield call(api.lists.addAList, NewTodoListEntity(listName));
    }
    yield openAListByIdSaga({ payload: listId, type: '' });
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
    yield call(api.lists.editAList, { _id: toListId, ...data } as TodoList);
    yield openAListByIdSaga({ payload: toListId, type: '' });
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
    yield call(api.lists.editAList, { _id: toListId, ...data } as TodoList);
    yield call(api.lists.removeAList, fromListId);
    yield openAListByIdSaga({ payload: toListId, type: '' });
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
    yield openAListByIdSaga({ payload: action.payload.fromListId, type: '' });
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
    yield openAListByIdSaga({ payload: action.payload.toListId, type: '' });
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
    yield openAListByIdSaga({ payload: listId, type: '' });
    yield put(appActions.setMode(appModes.MODE_A_LIST));
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

// New, correct from here
/**
 * Called on startup
 */
function* startupSaga() {
  try {
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
    const listOfLists = yield call(api.lists.fetchListOfList);
    // Save received list
    yield put(listActions.getListOfLists.done(listOfLists));
    // Find/create today's list
    const todayListName = dayString(new Date());
    let todayList = listOfLists.find((list: TodoList) => list.name === todayListName);
    if (!todayList) {
      yield put(statusActions.setStatusMessage(`statusMessages.msgCreatingAList${todayListName}`));
      todayList = yield call(api.lists.addAList, NewTodoListEntity(todayListName));
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
      yield call(api.lists.editAList, todayList);
      yield put(statusActions.setStatusMessage(statusMessages.msgDeletingAList));
      yield all(legacyListIds.map((listId) => call(api.lists.removeAList, listId)));
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
  yield call(api.lists.removeAList, payload);
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
    const listOfLists = yield call(api.lists.fetchListOfList);
    const now = new Date();
    let shiftDate = new Date();

    for (let shift = 6; shift >= 0; shift--) {
      shiftDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * shift);
      const listName = dayString(shiftDate);
      if (!listOfLists.find((list: TodoList) => list.name === listName)) {
        yield call(api.lists.addAList, NewTodoListEntity(listName));
      }
    }
    yield getListOfListsSaga();
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
