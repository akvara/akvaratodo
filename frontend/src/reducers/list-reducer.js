import types from '../actions/types';
import BaseReducer from './base-reducer';
import CONST from '../utils/constants.js';
import * as Utils from '../utils/utils';

class AppReducer extends BaseReducer {

    constructor() {
        super();
        this.initialState = {};
        this.ACTION_HANDLERS = {
            [types.LIST_OF_LISTS.REQUEST]: this.listOfListsRequest,
            [types.LIST_OF_LISTS.SUCCESS]: this.listOfListsFetched,

            [types.REMOVE_LIST.REQUEST]: this.removeListRequest,
            [types.CONCAT_LISTS]: this.concatListsRequest,
            [types.PREPEND]: this.prependRequest,

            [types.LOOKING_FOR_A_LIST.REQUEST]: this.addAListRequest,
            [types.LOOKING_FOR_A_LIST.SUCCESS]: this.listsRefreshed,

            [types.UPDATE_LIST.SUCCESS]: this.listSaved,

            [types.GET_A_LIST.SUCCESS]: this.aListFetched,
            [types.CHECK_AND_SAVE]: this.checkAList,

            [types.ERROR]: this.error,
            [types.DATA_CONFLICT]: this.dataConflict,
        };
    }

    listOfListsRequest(state) {
        return {
            ...state,
            status_msg: 'Loading lists ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    listsRefreshed(state) {
        return {
            ...state,
            status_msg: 'Lists refreshed',
            mode: CONST.mode.MODE_LOADING
        };
    }

    removeListRequest(state) {
        return {
            ...state,
            status_msg: 'Removing list ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    concatListsRequest(state) {
        return {
            ...state,
            status_msg: 'Adding a list on top ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    prependRequest(state) {
        return {
            ...state,
            status_msg: 'Adding on top ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    addAListRequest(state) {
        return {
            ...state,
            status_msg: 'Checking lists ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    checkAList(state) {
        return {
            ...state,
            status_msg: 'Checking a list ...',
        };
    }

    listSaved(state) {
        return {
            ...state,
            status_msg: 'List saved',
        };
    }

    listOfListsFetched(state, action) {
        return {
            ...state,
            lists: Utils.sortArrOfObjectsByParam(action.payload, 'updatedAt', true),
            status_msg: 'Lists loaded',
            mode: CONST.mode.MODE_LIST_OF_LISTS
        };
    }

    aListFetched(state, action) {
        return {
            ...state,
            a_list: action.payload,
            status_msg: action.payload.name + ' loaded',
            mode: CONST.mode.MODE_A_LIST
        };
    }

    error(state, action) {
        return {
            ...state,
            mode: CONST.mode.ERROR
        };
    }

    dataConflict(state, action) {
        let date = (new Date(action.payload)).toLocaleTimeString("lt-LT");
        return {
            ...state,
            status_msg: date,
            mode: CONST.mode.DATA_CONFLICT
        };
    }

}

export default new AppReducer().handleActions;
