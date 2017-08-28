import types from '../actions/types';
import BaseReducer from './base-reducer';

class TestReducer extends BaseReducer {

    constructor() {
        super();
        this.initialState = {};
        this.ACTION_HANDLERS = {
            [types.TEST_ASYNC.SUCCESS]: this.testAsync,
            [types.TEST_SYNC]: this.testSync,
        };
    }

    testAsync(state, action) {
        return {
            ...state,
            testPart: action.payload,
        };
    }

    testSync(state) {
        return {
            ...state,
            testPart: null,
        };
    }
}

export default new TestReducer().handleActions;
