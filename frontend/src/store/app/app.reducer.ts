import { createReducer } from '../../utils/frontend.utils';
import { ListCreds, TodoList } from '../types';
import * as Utils from '../../utils/utils';
import { appActions, listActions } from '../actions';
import { appModes } from '../../config/constants';

export type AppState = {
  mode: string;
  lists: TodoList[];
  aList: TodoList;
  task: string;
  fromList: ListCreds;
};

export const initialState: AppState = {
  mode: appModes.MODE_LOADING,
  lists: [],
  aList: { id: '', userId: 0, name: '', tasks: '', done: '', immutable: false, lastAction: '' },
  task: '',
  fromList: { listId: '', name: '' },
};

const appReducer = createReducer(initialState, {
  [appActions.moveInitiationAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      // statusMsg: 'Move task to ... ',
      mode: appModes.MODE_MOVE,
      fromList: action.payload.fromList,
      task: action.payload.task,
    };
  },
  [appActions.moveToListAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      // statusMsg: 'Adding on top ...',
      mode: appModes.MODE_LOADING,
    };
  },
  [appActions.importListAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      // statusMsg: 'Adding a list on top ...',
      mode: appModes.MODE_LOADING,
    };
  },
  [appActions.exportListAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      // statusMsg: 'Exporting to a list ...',
      mode: appModes.MODE_LOADING,
    };
  },
  [appActions.errorAction.type]: (state: AppState) => {
    return {
      ...state,
      mode: appModes.MODE_ERROR,
    };
  },
  [appActions.dataConflictAction.type]: (state: AppState, action: any) => {
    return {
      ...state,
      // statusMsg: new Date(action.payload).toLocaleTimeString('lt-LT'),
      mode: appModes.DATA_CONFLICT,
    };
  },

  // New, correct from here

  [appActions.setMode.type]: (state: AppState, action: ReturnType<typeof appActions.setMode>) => {
    return {
      ...state,
      mode: action.payload,
    };
  },
  [listActions.getListOfLists.done.type]: (
    state: AppState,
    action: ReturnType<typeof listActions.getListOfLists.done>,
  ) => {
    return {
      ...state,
      lists: Utils.sortArrOfObjectsByParam(action.payload, 'updatedAt', true),
    };
  },
  [listActions.getAList.done.type]: (state: AppState, action: ReturnType<typeof listActions.getListOfLists.done>) => {
    return {
      ...state,
      aList: action.payload,
    };
  },
});

export default appReducer;
