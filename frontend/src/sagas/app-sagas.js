import types from '../actions/types';
import {fetchItemSaga, createItemSaga} from './common-sagas';
import {takeEvery, takeLatest, all} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
import * as UrlUtils from '../utils/urlUtils';
import {TaskEntity} from "../utils/entity";
import Failure from '../components/Failure';

export function* listOfListsRequest(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

/* Trying to find list by this name */
function* lookForAList(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LOOKING_FOR_A_LIST, action.payload.data);
}

function* checkIfExists(data) {
    let listName = data.transit,
        lists = data.payload,
        filtered = lists.filter((e) => e.name === listName);

    if (filtered.length) {
        return yield fetchItemSaga(UrlUtils.getAListUrl(filtered[0]._id), types.A_LIST);
    }

    yield createItemSaga(UrlUtils.getListsUrl(), TaskEntity(listName), types.NEW_LIST);
}

export function* getAListRequest(action) {
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.A_LIST);
}

function* generalFailure(e) {
    yield renderComponent(Failure);
}

export default function* listSagas() {
    yield all([
        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
        takeLatest(types.LIST_OF_LISTS.FAILURE, generalFailure),

        takeEvery(types.ADD_OR_OPEN_LIST, lookForAList),

        takeEvery(types.LOOKING_FOR_A_LIST.SUCCESS, checkIfExists),
        takeLatest(types.LOOKING_FOR_A_LIST.FAILURE, generalFailure),

        takeEvery(types.A_LIST.REQUEST, getAListRequest),
        takeLatest(types.A_LIST.FAILURE, generalFailure),

        takeEvery(types.NEW_LIST.SUCCESS, getAListRequest),
        takeEvery(types.NEW_LIST.FAILURE, generalFailure),
    ]);
}
