import types from './types';

export function getListOfLists(data, resolve, reject) {
    return {
        type: types.LIST_OF_LISTS.REQUEST, payload: {data, resolve, reject}
    };
}

export function getAList(data, resolve, reject) {
    console.log('list-actions: getAList');
    return {
        type: types.A_LIST.REQUEST, payload: {data, resolve, reject}
    };
}

export function addOrOpenAList(data, resolve, reject) {
    return {
        type: types.ADD_A_LIST.REQUEST, payload: {data, resolve, reject}
    };
}
