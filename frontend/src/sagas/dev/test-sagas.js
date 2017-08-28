import {takeEvery, takeLatest} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
import * as UrlUtils from '../utils/urlUtils.js';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Failure from '../components/Failure';
import {fetchItemSaga} from './common-sagas';
import types from '../actions/types';
import { all } from 'redux-saga/effects'

export function* testSync() {
    yield console.log('testSync saga');
    yield renderComponent(Success);
}

export function* testAsyncRequest(action) {
    yield console.log('testAsync saga, action:', action);
    yield renderComponent(Loading);
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.TEST_ASYNC);
}

function* testAsyncSuccess(data) {
    yield console.log('testAsync SUCCESS', data);
    yield renderComponent(Success);
}
function* testAsyncFailure(e) {
    yield console.log('testAsync FAILURE', e);
    yield renderComponent(Failure);
}

export default function* testSagas() {
    yield all([
        takeEvery(types.TEST_SYNC, testSync),
        takeEvery(types.TEST_ASYNC.REQUEST, testAsyncRequest),
        takeEvery(types.TEST_ASYNC.SUCCESS, testAsyncSuccess),
        takeLatest(types.TEST_ASYNC.FAILURE, testAsyncFailure)
    ]);
}
