import { combineReducers } from 'redux';
import AppReducer from './list-reducer';
import { ListCreds, TodoList } from '../../core/types';

export interface RootState {
  app: {
    status_msg: string;
    mode: string;
    lists: TodoList[];
    a_list: TodoList;
    task: string;
    from_list: ListCreds;
  }
}

export default combineReducers({
  app: AppReducer,
});
