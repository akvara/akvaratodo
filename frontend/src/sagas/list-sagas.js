import types from '../actions/types';
import {fetchItemSaga} from './common-sagas';
import {takeEvery, takeLatest, put} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
import * as UrlUtils from '../utils/urlUtils.js';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Failure from '../components/Failure';

export function* listOfListsRequest(action) {
    yield console.log('listOfLists saga, action:', action);
    yield renderComponent(Loading);
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

function* listOfListsSuccess(data) {
    yield console.log('listOfLists SUCCESS', data);
    yield renderComponent(Success);
}

function* listOfListsFailure(e) {
    yield console.log('listOfLists FAILURE', e);
    yield renderComponent(Failure);
}

export function* aListRequest(action) {
    yield console.log('listOfLists saga, action:', action);
    yield renderComponent(Loading);
    yield fetchItemSaga(UrlUtils.getAListUrl(), types.A_LIST);
}

function* aListSuccess(data) {
    yield console.log('listOfLists SUCCESS', data);
    yield renderComponent(Success);
}

function* aListFailure(e) {
    yield console.log('listOfLists FAILURE', e);
    yield renderComponent(Failure);
}

export default function* listSagas() {
    yield [
        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
        takeEvery(types.LIST_OF_LISTS.SUCCESS, listOfListsSuccess),
        takeLatest(types.LIST_OF_LISTS.FAILURE, listOfListsFailure),
        takeEvery(types.A_LIST.REQUEST, aListRequest),
        takeEvery(types.A_LIST.SUCCESS, aListSuccess),
        takeLatest(types.A_LIST.FAILURE, aListFailure),
    ];
}
