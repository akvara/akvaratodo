import {combineReducers} from 'redux';
import AppReducer from './app-reducer';
import TestReducer from './test-reducer';

export default combineReducers({
    app: AppReducer,
    test: TestReducer
});
