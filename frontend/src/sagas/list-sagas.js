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

function* checkAndSave(action) {
    let new_data = action.payload.data,
        listId = new_data.listId;
    let originalList = yield call(callGet, UrlUtils.getAListUrl(listId));
    yield console.log(' checkAndSave comparing - ', originalList.lastAction, "with", new_data.previousAction);
    if (originalList.lastAction !== new_data.previousAction) {
    // if (true) {
        if (new_data.taskToAdd ) {
            console.log("Will try to add to top:", new_data);
            let payload = {
                data: {
                    listId: listId,
                    task: new_data.taskToAdd
                }
            };
            return yield put({type: types.PREPEND, payload});
        }

        return yield put({type: types.DATA_CONFLICT, payload: originalList.lastAction});
    }

    yield updateItemSaga(
        UrlUtils.getAListUrl(listId),
        new_data.listData,
        types.UPDATE_LIST
    );
}

function* addOrOpenListsSaga(action) {
    try {
        let listOfLists = yield call(callGet, UrlUtils.getListsUrl()),
            listName = action.payload.data,
            filtered = listOfLists.filter((e) => e.name === listName);

        if (filtered.length) {
            return yield fetchItemSaga(UrlUtils.getAListUrl(filtered[0]._id), types.GET_A_LIST);
        }

        return yield createItemSaga(UrlUtils.getListsUrl(), NewTaskEntity(listName), types.NEW_LIST);
    } catch (e) {
        yield generalFailure(e);
    }
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

        const new_data = action.payload.data;
        const url = UrlUtils.getAListUrl(new_data.listId);

        let originalList = yield call(callGet, url);

        let data = {
            lastAction: new Date().toISOString(),
            tasks: Utils.prependToJSON(new_data.task, originalList.tasks)
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

        takeEvery(types.GET_A_LIST.REQUEST, getAListRequest),
        takeEvery(types.GET_A_LIST.FAILURE, generalFailure),

        takeEvery(types.REMOVE_LIST.REQUEST, removeListRequest),
        takeEvery(types.REMOVE_LIST.SUCCESS, listOfListsRequest),
        takeEvery(types.REMOVE_LIST.FAILURE, generalFailure),

        takeEvery(types.NEW_LIST.SUCCESS, getAListRequest),
        takeEvery(types.NEW_LIST.FAILURE, generalFailure),

        takeEvery(types.UPDATE_LIST.FAILURE, generalFailure),

        takeEvery(types.ADD_OR_OPEN_LIST, addOrOpenListsSaga),
        takeEvery(types.CHECK_AND_SAVE, checkAndSave),
        takeEvery(types.PREPEND, prependToAListSaga),
        takeEvery(types.CONCAT_LISTS, concatListsSaga),
    ]);
}
