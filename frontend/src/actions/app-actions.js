import types from './types';

export function init() {
    return {type: types.INIT, payload: {}};
}

export function openAList(listId) {
    return {type: types.APP_GET_A_LIST, payload: {listId}};
}
