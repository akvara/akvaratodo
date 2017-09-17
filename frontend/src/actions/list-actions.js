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

export function removeList(data, resolve, reject) {
    return {
        type: types.REMOVE_LIST.REQUEST, payload: {data, resolve, reject}
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

export function prependToAList(data, resolve, reject) {
    return {
        type: types.PREPEND, payload: {data, resolve, reject}
    };
}

export function concatLists(data, resolve, reject) {
    return {
        type: types.CONCAT_LISTS, payload: {data, resolve, reject}
    };
}

export function moveOutside(data, resolve, reject) {
    return {
        type: types.MOVE_CHOOSE, payload: {data, resolve, reject}
    };
}

export function moveToList(data, resolve, reject) {
    return {
        type: types.MOVE_TO, payload: {data, resolve, reject}
    };
}

export function copyOrMoveToNew(data, resolve, reject) {
    return {
        type: types.COPY_OR_MOVE, payload: {data, resolve, reject}
    };
}

export function error(data, resolve, reject) {
    return {
        type: types.ERROR, payload: {data, resolve, reject}
    };
}
