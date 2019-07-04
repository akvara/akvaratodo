import { combineReducers } from 'redux';
import AppReducer from './list/list.reducer';
import { ListCreds, TodoList } from './types';

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
