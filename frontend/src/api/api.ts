import { call } from 'redux-saga/effects';
import { callGet, callUpdate, callDelete } from '../utils/api';
import * as urlUtils from '../utils/urlUtils';
import { TodoListUpdate } from '../store/types';

export function* getListOfLists() {
  const url = urlUtils.getListsUrl();
  return yield call(callGet, url);
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
