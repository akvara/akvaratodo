import types from '../actions/types';
import {fetchItemSaga, createItemSaga, removeItemSaga, updateItemSaga} from './common-sagas';
import {callGet, callPost, callUpdate, callDelete} from '../utils/api';
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
    if (originalList.lastAction !== new_data.previousAction) {
        if (new_data.taskToAdd ) {
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

function* getAListRequest(action) {
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.GET_A_LIST);
}

function* getAListSuccess(action) {
    if (!action.payload) {
        yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
    }
}

function* removeListRequest(action) {
    yield removeItemSaga(UrlUtils.getAListUrl(action.payload.data), action.payload.data, types.REMOVE_LIST);
}

/*
* params: list name as action.payload.data.listName
* returns listId
*/
function* findOrCreateListByName(action) {
    try {
        let url = UrlUtils.getListsUrl(),
            listName = action.payload.data.listName,
            listOfLists = yield call(callGet, url),
            filtered = listOfLists.filter((e) => e.name === listName);

        if (filtered.length) {
            return filtered[0]._id;
        }
        const result = yield call(callPost, url, NewTaskEntity(listName));
        yield fetchItemSaga(UrlUtils.getListsUrl(), types.REFRESH_LIST);
        return result._id;
    } catch (e) {
        yield generalFailure(e);
    }
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

function* planWeek() {
    const days = ['Sekmadienį','Pirmadienį','Antradienį','Trečiadienį','Ketvirtadienį','Penktadienį','Šeštadienį'];
    const months = ['sausio','vasario','kovo','balandžio','gegužės','birželio','liepos','rugpjūčio','rugsėjo','spalio','lapkričio','gruodžio'];

    try {
        let listOfLists = yield call(callGet, UrlUtils.getListsUrl());
        let now = new Date();
        let shift_date = new Date();
        let shift = 0;

        for (let d = now.getDay(); d < 7; d++) {
            shift_date.setDate(now.getDate() + shift++);
            let listName = `${days[d]}, ${months[shift_date.getMonth()]} ${shift_date.getDate()} d.`;
            let filtered = listOfLists.filter((e) => e.name === listName);
            if (!filtered.length) {
                yield call(callPost, UrlUtils.getListsUrl(), NewTaskEntity(listName));
            }
        }
        return yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
    } catch (e) {
        yield generalFailure(e);
    }
}

function* generalFailure(e) {
    yield put({type: types.ERROR, payload: e});
}

function* importListSaga(action) {
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

function* exportListSaga(action) {
    try {
        const urlThisList = UrlUtils.getAListUrl(action.payload.data.listId);
        const urlToThatList = UrlUtils.getAListUrl(action.payload.data.toListId);
        const thisList = yield call(callGet, urlThisList);
        const toThatList = yield call(callGet, urlToThatList);
        let data = {
            lastAction: new Date().toISOString(),
            tasks: Utils.concatTwoJSONs(thisList.tasks, toThatList.tasks)
        };
        yield call(callUpdate, urlToThatList, data);
        yield call(callDelete, urlThisList);
        return yield fetchItemSaga(urlToThatList, types.GET_A_LIST);
    } catch (e) {
        yield generalFailure(e);
    }
}

function* moveTaskToAnotherListSaga(action) {
    try {
        yield removeTaskFromListSaga(action);
        yield prependToAListSaga(action);
    } catch (e) {
        yield generalFailure(e);
    }
}

function* copyOrMoveToNewListSaga(action) {
    try {
        let listId = yield findOrCreateListByName(action);
        action.payload.data.listId = listId;

        if (action.payload.data.move) {
            yield removeTaskFromListSaga(action);
        }
        yield prependToAListSaga(action);
    } catch (e) {
        yield generalFailure(e);
    }
}

/* Expects: {listId, task} */
function* prependToAListSaga(action) {
    try {
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

/* Expects: {fromListId, task} */
function* removeTaskFromListSaga(action) {
    try {
        const new_data = action.payload.data;
        const url = UrlUtils.getAListUrl(new_data.fromListId);

        let originalList = yield call(callGet, url);

        let data = {
            lastAction: new Date().toISOString(),
            tasks: Utils.removeTask(new_data.task, originalList.tasks)
        };
        yield call(callUpdate, url, data);
    } catch (e) {
        yield generalFailure(e);
    }
}

export default function* listSagas() {
    yield all([
        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),
        takeEvery(types.LIST_OF_LISTS.FAILURE, generalFailure),

        takeEvery(types.GET_A_LIST.REQUEST, getAListRequest),
        takeEvery(types.GET_A_LIST.SUCCESS, getAListSuccess),
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
        takeEvery(types.MOVE_TO, moveTaskToAnotherListSaga),
        takeEvery(types.COPY_OR_MOVE, copyOrMoveToNewListSaga),
        takeEvery(types.IMPORT_LIST, importListSaga),
        takeEvery(types.EXPORT_LIST, exportListSaga),
        takeEvery(types.PLAN_WEEK, planWeek),
    ]);
}
