import {combineReducers} from 'redux';
import ListReducer from './list-reducer';
import TestReducer from './test-reducer';

export default combineReducers({
    list: ListReducer,
    test: TestReducer
});
