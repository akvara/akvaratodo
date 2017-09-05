import types from '../actions/types';
import BaseReducer from './base-reducer';
import CONST from '../utils/constants.js';

class AppReducer extends BaseReducer {

    constructor() {
        super();
        this.initialState = {};
        this.ACTION_HANDLERS = {
            [types.LIST_OF_LISTS.REQUEST]: this.listOfListsRequest,
            [types.LIST_OF_LISTS.SUCCESS]: this.listOfListsFetched,

            [types.REMOVE_LIST.REQUEST]: this.removeListRequest,

            [types.LOOKING_FOR_A_LIST.REQUEST]: this.addAListRequest,
            [types.LOOKING_FOR_A_LIST.SUCCESS]: this.listsRefreshed,

            [types.GET_A_LIST.SUCCESS]: this.aListFetched,
            [types.CHECK_AND_SAVE]: this.checkAList,

            [types.ERROR]: this.error,
            [types.DATA_CONFLICT]: this.dataConflict,
        };
    }

    listOfListsRequest(state, action) {
        return {
            ...state,
            status_msg: 'Loading lists ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    listsRefreshed(state, action) {
        return {
            ...state,
            status_msg: 'Lists refreshed',
            mode: CONST.mode.MODE_LOADING
        };
    }

    removeListRequest(state, action) {
        return {
            ...state,
            status_msg: 'Removing list ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    addAListRequest(state, action) {
        return {
            ...state,
            status_msg: 'Checking lists ...',
            mode: CONST.mode.MODE_LOADING
        };
    }

    checkAList(state, action) {
        return {
            ...state,
            status_msg: 'Checking a list ...',
        };
    }

    listOfListsFetched(state, action) {
        return {
            ...state,
            lists: action.payload,
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
