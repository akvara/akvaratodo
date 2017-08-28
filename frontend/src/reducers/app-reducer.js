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

            [types.ADD_A_LIST.REQUEST]: this.addAListRequest,

            [types.A_LIST.SUCCESS]: this.aListFetched,
        };
    }

    listOfListsRequest(state, action) {
        return {
            ...state,
            status_msg: 'Loading lists ...',
            mode: CONST.mode.LOADING
        };
    }

    addAListRequest(state, action) {
        return {
            ...state,
            status_msg: 'Creating list ...',
            mode: CONST.mode.LOADING
        };
    }

    listOfListsFetched(state, action) {
        return {
            ...state,
            lists: action.payload,
            status_msg: 'Lists loaded.',
            mode: CONST.mode.LIST_OF_LISTS
        };
    }

    aListFetched(state, action) {
        return {
            ...state,
            a_list: action.payload,
            mode: CONST.mode.A_LIST
        };
    }
}

export default new AppReducer().handleActions;
