import {combineReducers} from 'redux';
import AppReducer from './list-reducer';

export default combineReducers({
    app: AppReducer
});
