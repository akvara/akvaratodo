import types from '../actions/types';
import BaseReducer from './base-reducer';

class ListReducer extends BaseReducer {

    constructor() {
        super();
        this.initialState = {};
        this.ACTION_HANDLERS = {
            [types.GET_CURRENT_USER.SUCCESS]: this.userFetched,
            [types.LOGOUT]: this.logout,
        };
    }

    userFetched(state, action) {
        return {
            ...state,
            currentUser: action.payload,
        };
    }

    logout(state) {
        return {
            ...state,
            currentUser: null,
        };
    }
}

export default new ListReducer().handleActions;
