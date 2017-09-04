import types from './types';

export function getListOfLists(data, resolve, reject) {
    return {
        type: types.LIST_OF_LISTS.REQUEST, payload: {data, resolve, reject}
    };
}

export function getAList(data, resolve, reject) {
    return {
        type: types.GET_A_LIST.REQUEST, payload: {data, resolve, reject}
    };
}

export function addOrOpenAList(data, resolve, reject) {
    return {
        type: types.ADD_OR_OPEN_LIST, payload: {data, resolve, reject}
    };
}

export function checkAndSave(data, resolve, reject) {
    return {
        type: types.CHECK_AND_SAVE, payload: {data, resolve, reject}
    };
}

export function removeList(data, resolve, reject) {
    // console.log("list actions removeList data:", data);
    return {
        type: types.REMOVE_LIST.REQUEST, payload: {data, resolve, reject}
    };
}
