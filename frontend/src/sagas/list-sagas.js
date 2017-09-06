import types from '../actions/types';
import {fetchItemSaga, createItemSaga, removeItemSaga, updateItemSaga, concatListsSaga} from './common-sagas';
import {takeEvery, put, all} from 'redux-saga/effects';
import * as UrlUtils from '../utils/urlUtils';
import {NewTaskEntity} from "../utils/entity";

function* listOfListsRequest() {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

/* Trying to find list by this name */
function* lookForAList(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LOOKING_FOR_A_LIST, action.payload.data);
}

function* checkLastActionDate(action) {
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data.listId), types.CHECK_DATE, action.payload.data);
}

function* prependToAList(action) {
    console.log("prependToAList(action)" , action);
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data.listId), types.PREPEND, action.payload.data);
}

function* prependSuccess(action) {
    console.log("action prepend", action);
    let new_todo = action.transit.prepend.concat(JSON.parse(action.payload.tasks)),
        new_data = {tasks: JSON.stringify(new_todo)};

    yield updateItemSaga(
        UrlUtils.getAListUrl(action.transit.listId),
        new_data,
        types.GET_A_LIST
    );
}

function* checkAndSave(action) {
    yield console.log('checkAndSave - ', action);
    yield console.log('comparing - ', action.payload.lastAction, "with", action.transit.previousAction);
    if (action.payload.lastAction !== action.transit.previousAction) {
    // if (true) {
        return yield put({type: types.DATA_CONFLICT, payload: action.payload.lastAction});
    }

    console.log("action.transit", action.transit);
    yield updateItemSaga(
        UrlUtils.getAListUrl(action.transit.listId),
        action.transit.listData,
        types.UPDATE_LIST
    );
}

function* checkIfExists(data) {
    let listName = data.transit,
        lists = data.payload,
        filtered = lists.filter((e) => e.name === listName);

    if (filtered.length) {
        return yield fetchItemSaga(UrlUtils.getAListUrl(filtered[0]._id), types.GET_A_LIST);
    }

    yield createItemSaga(UrlUtils.getListsUrl(), NewTaskEntity(listName), types.NEW_LIST);
}

function* concatListsSuccess(action) {
    yield console.log("concatListsSuccess action", action);
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.GET_A_LIST);
}

function* getAListRequest(action) {
    console.log("getAListRequest action", action);
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.GET_A_LIST);
}

function* removeListRequest(action) {
    yield removeItemSaga(UrlUtils.getAListUrl(action.payload.data), action.payload.data, types.REMOVE_LIST);
}

function* generalFailure(e) {
    yield put({type: types.ERROR, payload: e});
}

function* concatListsRequest(action) {
    yield concatListsSaga(
        UrlUtils.getAListUrl(action.payload.data.firstListId),
        UrlUtils.getAListUrl(action.payload.data.secondListId),
        types.CONCAT_LISTS
    );
    // yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data.secondListId, types.GET_A_LIST));
}

export default function* listSagas() {
    yield all([
        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
        takeEvery(types.LIST_OF_LISTS.FAILURE, generalFailure),

        takeEvery(types.ADD_OR_OPEN_LIST, lookForAList),
        takeEvery(types.CHECK_AND_SAVE, checkLastActionDate),

        takeEvery(types.LOOKING_FOR_A_LIST.SUCCESS, checkIfExists),
        takeEvery(types.LOOKING_FOR_A_LIST.FAILURE, generalFailure),
        
        takeEvery(types.CHECK_DATE.SUCCESS, checkAndSave),
        takeEvery(types.CHECK_DATE.FAILURE, generalFailure),

        takeEvery(types.GET_A_LIST.REQUEST, getAListRequest),
        takeEvery(types.GET_A_LIST.FAILURE, generalFailure),

        takeEvery(types.REMOVE_LIST.REQUEST, removeListRequest),
        takeEvery(types.REMOVE_LIST.SUCCESS, listOfListsRequest),
        takeEvery(types.REMOVE_LIST.FAILURE, generalFailure),

        takeEvery(types.NEW_LIST.SUCCESS, getAListRequest),
        takeEvery(types.NEW_LIST.FAILURE, generalFailure),

        // takeEvery(types.UPDATE_LIST.SUCCESS, updateListSuccess),
        takeEvery(types.UPDATE_LIST.FAILURE, generalFailure),

        takeEvery(types.PREPEND.REQUEST, prependToAList),
        takeEvery(types.PREPEND.SUCCESS, prependSuccess),
        takeEvery(types.PREPEND.FAILURE, generalFailure),

        takeEvery(types.CONCAT_LISTS.REQUEST, concatListsRequest),
        takeEvery(types.CONCAT_LISTS.SUCCESS, concatListsSuccess),
        takeEvery(types.CONCAT_LISTS.FAILURE, generalFailure),
    ]);
}
