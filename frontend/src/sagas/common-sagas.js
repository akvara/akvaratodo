import {call, put} from 'redux-saga/effects';
import {callDelete, callGet, callPost, callUpdate} from '../utils/api';

export function* fetchItemSaga(url, actionType) {
    try {
        const result = yield call(callGet, url);
        yield put({type: actionType.SUCCESS, payload: result});
    } catch (e) {
        yield put({type: actionType.FAILURE, payload: e});
    }
}

export function* removeItemSaga(url, data, actionType) {
    try {
        yield call(callDelete, url);
        yield put({type: actionType.SUCCESS, payload: data});
    } catch (e) {
        yield put({type: actionType.FAILURE, payload: e});
    }
}

export function* updateItemSaga(url, data, actionType) {
    try {
        yield call(callUpdate, url, data);
        yield put({type: actionType.SUCCESS, payload: data});
    } catch (e) {
        yield put({type: actionType.FAILURE, payload: e});
    }
}

export function* createItemSaga(url, data, actionType) {
    try {
        const result = yield call(callPost, url, data);
        let payload = {data: result._id};
        yield put({type: actionType.SUCCESS, payload: payload});
    } catch (e) {
        yield put({type: actionType.FAILURE, payload: e});
    }
}
