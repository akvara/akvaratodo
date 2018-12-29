import { combineReducers } from 'redux';
import AppReducer from './list-reducer';
import { ListCreds, TodoList } from '../../core/types';

export interface RootState {
  app: {
    statusMsg: string;
    mode: string;
    lists: TodoList[];
    aList: TodoList;
    task: string;
    fromList: ListCreds;
  }
}

export default combineReducers({
  app: AppReducer,
});
