import { call, put } from 'redux-saga/effects';
import { callDelete, callGet, callPost, callUpdate } from '../../utils/api';

export function* fetchItemSaga(url, actionType) {
  try {
    const result = yield call(callGet, url);
    yield put(actionType.done(result));
  } catch (e) {
    yield put(actionType.failure(e));
  }
}

export function* removeItemSaga(url, data, actionType) {
  try {
    yield call(callDelete, url);
    yield put(actionType.done(data));
  } catch (e) {
    yield put(actionType.failure(e));
  }
}

export function* updateItemSaga(url, data, actionType) {
  try {
    yield call(callUpdate, url, data);
    yield put(actionType.done(data));
  } catch (e) {
    yield put(actionType.failure(e));
  }
}

export function* createItemSaga(url, data, actionType) {
  try {
    const result = yield call(callPost, url, data);
    // let payload = { data: result._id };
    yield put(actionType.done(result._id));
  } catch (e) {
    yield put(actionType.failure(e));
  }
}
