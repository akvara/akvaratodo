import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import ListReducer from './list-reducer';


export default combineReducers({
    list: ListReducer
//     user: userReducer,
});
