import types from '../actions/types';
import BaseReducer from './base-reducer';

class ListReducer extends BaseReducer {

    constructor() {
        super();
        this.initialState = {};
        this.ACTION_HANDLERS = {
            [types.LIST_OF_LISTS.SUCCESS]: this.listOfListsFetched,
            [types.A_LIST.SUCCESS]: this.aListFetched,
        };
    }

    listOfListsFetched(state, action) {
        return {
            ...state,
            lists: action.payload,
        };
    }

    aListFetched(state, action) {
        return {
            ...state,
            list: action.payload,
        };
    }
}

export default new ListReducer().handleActions;
