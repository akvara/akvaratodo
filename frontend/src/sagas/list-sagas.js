import types from '../actions/types';
import {fetchItemSaga, createItemSaga, removeItemSaga, updateItemSaga} from './common-sagas';
import {callGet, callUpdate} from '../utils/api';
import {takeEvery, put, call, all} from 'redux-saga/effects';
import * as UrlUtils from '../utils/urlUtils';
import * as Utils from '../utils/utils.js';
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

function* checkAndSave(action) {
    yield console.log('checkAndSave - ', action);
    yield console.log('comparing - ', action.payload.lastAction, "with", action.transit.previousAction);
    if (action.payload.lastAction !== action.transit.previousAction) {
    // if (true) {
        console.log("***** taskToAdd", action.transit.taskToAdd);
        if (action.transit.taskToAdd) {
            console.log("bandom!");
        }
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

function* getAListRequest(action) {
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.GET_A_LIST);
}

function* removeListRequest(action) {
    yield removeItemSaga(UrlUtils.getAListUrl(action.payload.data), action.payload.data, types.REMOVE_LIST);
}

function* generalFailure(e) {
    yield put({type: types.ERROR, payload: e});
}

function* concatListsSaga(action) {
    try {
        const urlFirst = UrlUtils.getAListUrl(action.payload.data.firstListId);
        const urlSecond = UrlUtils.getAListUrl(action.payload.data.secondListId);
        const firstList = yield call(callGet, urlFirst);
        const second = yield call(callGet, urlSecond);
        let data = {
            lastAction: new Date().toISOString(),
            tasks: Utils.concatTwoJSONs(firstList.tasks, second.tasks)
        };
        yield call(callUpdate, urlSecond, data);
        return yield fetchItemSaga(urlSecond, types.GET_A_LIST);
    } catch (e) {
        yield generalFailure(e);
    }
}

function* prependToAListSaga(action) {
    try {
        console.log("prependToAList(action)" , action);

        const url = UrlUtils.getAListUrl(action.payload.data.listId);
        let originalList = yield call(callGet, url);
        console.log("originalList" , originalList);
        let data = {
            lastAction: new Date().toISOString(),
            tasks: Utils.prependToJSON("abra", originalList.tasks)
        };
        yield call(callUpdate, url, data);
        return yield fetchItemSaga(url, types.GET_A_LIST);
    } catch (e) {
        yield generalFailure(e);
    }
}

export default function* listSagas() {
    yield all([
        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
        takeEvery(types.LIST_OF_LISTS.FAILURE, generalFailure),

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

        takeEvery(types.UPDATE_LIST.FAILURE, generalFailure),

        takeEvery(types.ADD_OR_OPEN_LIST, lookForAList),
        takeEvery(types.CHECK_AND_SAVE, checkLastActionDate),

        takeEvery(types.PREPEND, prependToAListSaga),
        takeEvery(types.CONCAT_LISTS, concatListsSaga),
    ]);
}
