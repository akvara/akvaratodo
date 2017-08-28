import types from '../actions/types';
import {fetchItemSaga} from './common-sagas';
import {takeEvery, takeLatest} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
import * as UrlUtils from '../utils/urlUtils.js';
import Failure from '../components/Failure';
import { all } from 'redux-saga/effects'

export function* listOfListsRequest(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

function* listOfListsSuccess(data) {
    yield console.log('listOfLists SUCCESS', data);
}

export function* addAListRequest(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

function* addAListSuccess(data) {
    yield console.log('addAList SUCCESS', data);
}

export function* aListRequest(action) {
    yield console.log('action:', action);
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.A_LIST);
}

function* aListSuccess(data) {
    yield console.log('listOfLists SUCCESS', data);
}

function* generalFailure(e) {
    yield renderComponent(Failure);
}

export default function* listSagas() {
    yield all([
        takeEvery(types.INIT, listOfListsRequest),

        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
        takeEvery(types.LIST_OF_LISTS.SUCCESS, listOfListsSuccess),
        takeLatest(types.LIST_OF_LISTS.FAILURE, generalFailure),

        takeEvery(types.ADD_A_LIST.REQUEST, addAListRequest),
        takeEvery(types.ADD_A_LIST.SUCCESS, addAListSuccess),
        takeLatest(types.ADD_A_LIST.FAILURE, generalFailure),

        takeEvery(types.A_LIST.REQUEST, aListRequest),
        takeEvery(types.A_LIST.SUCCESS, aListSuccess),
        takeLatest(types.A_LIST.FAILURE, generalFailure),
    ]);
}
