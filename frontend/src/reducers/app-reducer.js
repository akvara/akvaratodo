import types from '../actions/types';
import BaseReducer from './base-reducer';

class AppReducer extends BaseReducer {

    constructor() {
        super();
        this.initialState = {};
        this.ACTION_HANDLERS = {
            [types.LIST_OF_LISTS.REQUEST]: this.listOfListsRequest,
            [types.LIST_OF_LISTS.SUCCESS]: this.listOfListsFetched,
            [types.A_LIST.SUCCESS]: this.aListFetched,
        };
    }

    listOfListsRequest(state, action) {
        return {
            ...state,
            status_msg: 'loading lists...',
            loading: true
        };
    }

    listOfListsFetched(state, action) {
        return {
            ...state,
            lists: action.payload,
            status_msg: 'Lists loaded.',
            loading: false
        };
    }

    aListFetched(state, action) {
        return {
            ...state,
            a_list: action.payload,
            loading: false
        };
    }
}

export default new AppReducer().handleActions;
