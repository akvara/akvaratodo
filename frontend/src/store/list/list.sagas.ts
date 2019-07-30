import { all, call, put } from 'redux-saga/effects';

import { generalFailure } from '../app/app.sagas';
import api from '../../core/api';
import { getAList, getListOfLists } from './list.actions';
import { NewTodoListEntity, TodoList } from '../types';
import { apiGetAList } from '../../core/api/utils';

export function* getListOfListsSagaHelper() {
  const result = yield call(api.lists.callGetListOfList);
  yield put(getListOfLists.done(result));
}

export function* getAListSagaHelper(listId: string) {
  const result = yield apiGetAList(listId);
  yield put(getAList.done(result));
  return result ? result.name : null;
}

export default function* listSagas() {
  yield all([]);
}

/**
 * Finds list by name or creates new
 */
export function* findOrCreateListByNameHelperSaga(listName: string) {
  try {
    const listOfLists = yield call(api.lists.callGetListOfList);
    const found = listOfLists.find((list: TodoList) => list.name === listName);
    if (found) {
      return found._id;
    }
    const newList = yield call(api.lists.callCreateAList, NewTodoListEntity(listName));
    return newList._id;
  } catch (e) {
    yield generalFailure(e);
  }
}
