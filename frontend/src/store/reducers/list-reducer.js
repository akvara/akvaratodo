import BaseReducer from './base-reducer';
import CONST from '../../utils/constants.js';
import * as Utils from '../../utils/utils';
import {
  addOrOpenListAction,
  getAListAction,
  getListOfListsAction,
  planWeekAction,
  removeListAction,
  checkAndSaveAction,
  updateListAction,
  importListAction,
  exportListAction,
  moveToListAction,
  moveInitiationAction,
  dataConflictAction,
  errorAction,
  refreshListAction,
} from '../../store/actions/list-actions';

class AppReducer extends BaseReducer {
  constructor() {
    super();
    this.initialState = {};
    this.ACTION_HANDLERS = {
      [getListOfListsAction.started]: this.listOfListsRequest,
      [getListOfListsAction.done]: this.listOfListsFetched,
      [refreshListAction.done]: this.listOfListsRefreshed,

      [removeListAction.started]: this.removeListRequest,
      [updateListAction.done]: this.listSaved,

      [getAListAction.started]: this.getAListRequest,
      [getAListAction.done]: this.aListFetched,

      [checkAndSaveAction]: this.checkAList,
      [moveInitiationAction]: this.moveTo,
      [moveToListAction]: this.prependRequest,
      [importListAction]: this.importListRequest,
      [exportListAction]: this.exportListRequest,
      [addOrOpenListAction]: this.addAListRequest,

      [planWeekAction]: this.planWeek,

      [errorAction]: this.error,
      [dataConflictAction]: this.dataConflict,
    };
  }

  listOfListsRequest(state) {
    return {
      ...state,
      statusMsg: 'Loading lists ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  getAListRequest(state) {
    return {
      ...state,
      statusMsg: 'Loading list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  planWeek(state) {
    return {
      ...state,
      statusMsg: 'Planing a week ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  removeListRequest(state) {
    return {
      ...state,
      statusMsg: 'Removing list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  importListRequest(state) {
    return {
      ...state,
      statusMsg: 'Adding a list on top ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  exportListRequest(state) {
    return {
      ...state,
      statusMsg: 'Exporting to a list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  prependRequest(state) {
    return {
      ...state,
      statusMsg: 'Adding on top ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  addAListRequest(state) {
    return {
      ...state,
      statusMsg: 'Checking lists ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  checkAList(state) {
    return {
      ...state,
      statusMsg: 'Checking a list ...',
    };
  }

  listSaved(state) {
    return {
      ...state,
      statusMsg: 'List saved',
    };
  }

  listOfListsRefreshed(state, action) {
    return {
      ...state,
      lists: Utils.sortArrOfObjectsByParam(action.payload, 'updatedAt', true),
    };
  }

  listOfListsFetched(state, action) {
    return {
      ...state,
      statusMsg: 'Lists loaded',
      mode: CONST.mode.MODE_LIST_OF_LISTS,
      lists: Utils.sortArrOfObjectsByParam(action.payload, 'updatedAt', true),
    };
  }

  aListFetched(state, action) {
    if (!action.payload) {
      return state;
    }
    return {
      ...state,
      statusMsg: action.payload.name + ' loaded',
      mode: CONST.mode.MODE_A_LIST,
      aList: action.payload,
    };
  }

  moveTo(state, action) {
    return {
      ...state,
      statusMsg: 'Move task to ... ',
      mode: CONST.mode.MODE_MOVE,
      fromList: action.payload.fromList,
      task: action.payload.task,
    };
  }

  error(state) {
    return {
      ...state,
      mode: CONST.mode.ERROR,
    };
  }

  dataConflict(state, action) {
    let date = new Date(action.payload).toLocaleTimeString('lt-LT');
    return {
      ...state,
      statusMsg: date,
      mode: CONST.mode.DATA_CONFLICT,
    };
  }
}

export default new AppReducer().handleActions;
