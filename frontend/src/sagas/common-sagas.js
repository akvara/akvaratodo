import {put, call} from 'redux-saga/effects';
import {callGet, callUpdate, callDelete} from '../utils/api';

export function* fetchItemSaga(url, actionType, transit) {
    try {
        const result = yield call(callGet, url);
        yield put({type: actionType.SUCCESS, payload: result, transit: transit});
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
        yield call(callUpdate, url);
        yield put({type: actionType.SUCCESS, payload: data});
    } catch (e) {
        yield put({type: actionType.FAILURE, payload: e});
    }
}
