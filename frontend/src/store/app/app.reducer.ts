import { createReducer } from '../utils/frontend.utils';
import { getListOfListsAction } from '../list/list.actions';
import { ListCreds, TodoList } from '../types';
import CONST from '../../utils/constants';
import * as listActions from '../list/list.actions';
import * as appActions from './app.actions';
import * as Utils from '../../utils/utils';

export type AppState = {
  mode: string;
  lists: TodoList[];
  aList: TodoList;
  task: string;
  fromList: ListCreds;
  statusMsg: string;
};

export const initialState: AppState = {
  mode: '',
  lists: [],
  aList: { _id: '', userId: 0, name: '', tasks: '', done: '', immutable: false, lastAction: '' },
  task: '',
  fromList: { listId: '', name: '' },
  statusMsg: '',
};

const appReducer = createReducer(initialState, {
  [getListOfListsAction.started.type]: (state: AppState, action: any) => {
    return { ...state, statusMsg: 'Loading lists ...', mode: CONST.mode.MODE_LOADING };
  },
  [listActions.getListOfListsAction.done.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Lists loaded',
      mode: CONST.mode.MODE_LIST_OF_LISTS,
      lists: Utils.sortArrOfObjectsByParam(action.payload, 'updatedAt', true),
    };
  },
  [listActions.refreshListAction.done.type]: (state: AppState, action: any) => {
    return {
      ...state,
      lists: Utils.sortArrOfObjectsByParam(action.payload, 'updatedAt', true),
    };
  },

  [listActions.removeListAction.started.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Removing list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  },
  [listActions.updateListAction.done.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'List saved',
    };
  },

  [listActions.getAListAction.started.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Loading list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  },
  [listActions.getAListAction.done.type]: (state: AppState, action: any) => {
    if (!action.payload) {
      return state;
    }
    return {
      ...state,
      statusMsg: action.payload.name + ' loaded',
      mode: CONST.mode.MODE_A_LIST,
      aList: action.payload,
    };
  },

  [appActions.addOrOpenListByNameAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Checking lists ...',
      mode: CONST.mode.MODE_LOADING,
    };
  },
  [appActions.checkAndSaveAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Checking a list ...',
    };
  },
  [appActions.moveInitiationAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Move task to ... ',
      mode: CONST.mode.MODE_MOVE,
      fromList: action.payload.fromList,
      task: action.payload.task,
    };
  },
  [appActions.moveToListAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Adding on top ...',
      mode: CONST.mode.MODE_LOADING,
    };
  },
  [appActions.importListAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Adding a list on top ...',
      mode: CONST.mode.MODE_LOADING,
    };
  },
  [appActions.exportListAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Exporting to a list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  },
  [appActions.planWeekAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: 'Planing a week ...',
      mode: CONST.mode.MODE_LOADING,
    };
  },
  [appActions.errorAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      mode: CONST.mode.MODE_ERROR,
    };
  },
  [appActions.dataConflictAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      statusMsg: new Date(action.payload).toLocaleTimeString('lt-LT'),
      mode: CONST.mode.DATA_CONFLICT,
    };
  },
});

export default appReducer;
