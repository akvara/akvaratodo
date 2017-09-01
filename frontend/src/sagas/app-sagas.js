import types from '../actions/types';
import {fetchItemSaga} from './common-sagas';
import {takeEvery, takeLatest, all} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
import * as UrlUtils from '../utils/urlUtils.js';
import Failure from '../components/Failure';

export function* listOfListsRequest(action) {
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LIST_OF_LISTS);
}

// function* listOfListsSuccess(data) {
    // yield console.log('listOfLists SUCCESS', data);
// }

function* addAListRequest(action) {
    console.log('addAListRequest, action:', action);
    /* Trying to find list by this name */
    yield fetchItemSaga(UrlUtils.getListsUrl(), types.LOOKING_FOR_A_LIST, action.payload.data);
}

function* checkIfExists(data) {
    let compareWith = data.transit,
        lists = data.payload,
        filtered = lists.filter((e) => e.name === compareWith);

    if (filtered.length) {
        console.log('exists!:', filtered[0].name, filtered[0]._id);
        yield fetchItemSaga(UrlUtils.getAListUrl(filtered[0]._id), types.A_LIST);
        return;
    }

    yield alert("Will be creating list")
}

export function* getAListRequest(action) {
    yield fetchItemSaga(UrlUtils.getAListUrl(action.payload.data), types.A_LIST);
}

// function* aListSuccess(data) {
    // yield console.log('aListSuccess SUCCESS', data);
// }

function* generalFailure(e) {
    yield renderComponent(Failure);
}

export default function* listSagas() {
    yield all([
        takeEvery(types.LIST_OF_LISTS.REQUEST, listOfListsRequest),


        // takeEvery(types.LIST_OF_LISTS.SUCCESS, listOfListsSuccess),
        takeLatest(types.LIST_OF_LISTS.FAILURE, generalFailure),

        takeEvery(types.ADD_OR_OPEN_LIST, addAListRequest),

        takeEvery(types.LOOKING_FOR_A_LIST.SUCCESS, checkIfExists),
        takeLatest(types.LOOKING_FOR_A_LIST.FAILURE, generalFailure),

        takeEvery(types.A_LIST.REQUEST, getAListRequest),
        // takeEvery(types.A_LIST.SUCCESS, aListSuccess),
        takeLatest(types.A_LIST.FAILURE, generalFailure),
    ]);
}
