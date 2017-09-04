import types from '../actions/types';
import {fetchItemSaga, createItemSaga, removeItemSaga} from './common-sagas';
import {takeEvery, takeLatest, all} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
import * as UrlUtils from '../utils/urlUtils';
import {TaskEntity} from "../utils/entity";
import Failure from '../components/Failure';

function* listOfListsRequest(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

/* Trying to find list by this name */
function* lookForAList(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LOOKING_FOR_A_LIST, action.payload.data);
}

/* Trying to find list by this name */
function* checkAndSave(action) {
    yield console.log('checkAndSave - ', action)
    // yield fetchItemSaga(UrlUtils.getListsUrl(), types.LOOKING_FOR_A_LIST, action.payload.data);
}

function* checkIfExists(data) {
    let listName = data.transit,
        lists = data.payload,
        filtered = lists.filter((e) => e.name === listName);

    if (filtered.length) {
        return yield fetchItemSaga(UrlUtils.getAListUrl(filtered[0]._id), types.GET_A_LIST);
    }

    yield createItemSaga(UrlUtils.getListsUrl(), TaskEntity(listName), types.NEW_LIST);
}

function* getAListRequest(action) {
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.GET_A_LIST);
}

function* removeListRequest(action) {
    yield console.log("removeItemSaga", action);
    yield removeItemSaga(UrlUtils.getAListUrl(action.payload.data), action.payload.data, types.REMOVE_LIST);
}

// function* removeListSuccess(e) {
//     yield console.log("removeListSuccess****", e);
// }

function* generalFailure(e) {
    yield renderComponent(Failure);
}

export default function* listSagas() {
    yield all([
        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
        takeLatest(types.LIST_OF_LISTS.FAILURE, generalFailure),

        takeEvery(types.ADD_OR_OPEN_LIST, lookForAList),
        takeEvery(types.CHECK_AND_SAVE, checkAndSave),

        takeEvery(types.LOOKING_FOR_A_LIST.SUCCESS, checkIfExists),
        takeLatest(types.LOOKING_FOR_A_LIST.FAILURE, generalFailure),

        takeEvery(types.GET_A_LIST.REQUEST, getAListRequest),
        takeLatest(types.GET_A_LIST.FAILURE, generalFailure),

        takeEvery(types.REMOVE_LIST.REQUEST, removeListRequest),
        takeEvery(types.REMOVE_LIST.SUCCESS, listOfListsRequest),
        takeLatest(types.REMOVE_LIST.FAILURE, generalFailure),

        takeEvery(types.NEW_LIST.SUCCESS, getAListRequest),
        takeEvery(types.NEW_LIST.FAILURE, generalFailure),
    ]);
}
