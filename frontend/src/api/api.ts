import { call } from 'redux-saga/effects';
import { callGet, callUpdate, callDelete, callPost } from '../utils/api';
import * as urlUtils from '../utils/urlUtils';
import { NewTodoListEntity, TodoList, TodoListUpdate } from '../store/types';

export function* getListOfLists() {
  const url = urlUtils.getListsUrl();
  return yield call(callGet, url);
}

export function* createAList(listName: string) {
  const url = urlUtils.getListsUrl();
  return yield call(callPost, url, NewTodoListEntity(listName));
}

export function* fetchAList(listId: string) {
  const url = urlUtils.getAListUrl(listId);
  return yield call(callGet, url);
}

export function* updateAList(listId: string, data: TodoListUpdate) {
  const url = urlUtils.getAListUrl(listId);
  return yield call(callUpdate, url, data);
}

export function* deleteAList(listId: string) {
  const url = urlUtils.getAListUrl(listId);
  return yield call(callDelete, url);
}

export function* findListByName(listName: string) {
  const listOfLists = yield getListOfLists();
  const filtered = listOfLists.filter((list: TodoList) => list.name === listName);

  if (filtered.length) {
    return filtered[0]._id;
  }
  return null;
}
