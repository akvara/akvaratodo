import {takeEvery, takeLatest, put} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
import * as UrlUtils from '../utils/urlUtils.js';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Failure from '../components/Failure';


// import {push} from 'react-router-redux';
// import {getList} from '../actions/user-actions';
import {fetchItemSaga} from './common-sagas';

import types from '../actions/types';

export function* testSync() {
    yield console.log('testSync saga');
    // yield renderComponent('loading');
}

export function* testAsync(action) {
    yield console.log('testAsync saga, action:', action);
    yield renderComponent(Loading);
    yield fetchItemSaga(UrlUtils.getListsUrl()+"l", types.TEST_ASYNC);
}

// function* getListsSaga() {
    // yield fetchItemSaga(UrlUtils.getListsUrl(), types.GET_LIST_OF_LISTS);
// }

function* testAsyncSuccess(data) {
    yield console.log('testAsync SUCCESS', data);
    yield renderComponent(Success);

}
function* testAsyncFailure(e) {
    yield console.log('testAsync FAILURE', e);
    yield renderComponent(Failure);
}

export default function* userSagas() {
    yield [
        takeEvery(types.TEST_SYNC, testSync),
        takeEvery(types.TEST_ASYNC.REQUEST, testAsync),
        takeEvery(types.TEST_ASYNC.SUCCESS, testAsyncSuccess),
        takeLatest(types.TEST_ASYNC.FAILURE, testAsyncFailure)
    ];
}
