import { combineReducers } from 'redux';
import AppReducer from './list-reducer';
import { TodoList } from '../../core/types';

export interface RootState {
  app: {
    mode: string;
    lists: TodoList[];
    a_list: TodoList;
  }
}


export default combineReducers({
  app: AppReducer,
});

