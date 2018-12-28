import types from '../actions/types';
import BaseReducer from './base-reducer';
import CONST from '../../utils/constants.js';
import * as Utils from '../../utils/utils';

class AppReducer extends BaseReducer {
  constructor() {
    super();
    this.initialState = {};
    this.ACTION_HANDLERS = {
      [types.LIST_OF_LISTS.REQUEST]: this.listOfListsRequest,
      [types.LIST_OF_LISTS.SUCCESS]: this.listOfListsFetched,
      [types.REFRESH_LIST.SUCCESS]: this.listOfListsRefreshed,

      [types.REMOVE_LIST.REQUEST]: this.removeListRequest,
      [types.UPDATE_LIST.SUCCESS]: this.listSaved,

      [types.GET_A_LIST.REQUEST]: this.alistRequest,
      [types.GET_A_LIST.SUCCESS]: this.aListFetched,

      [types.CHECK_AND_SAVE]: this.checkAList,
      [types.MOVE_CHOOSE]: this.moveTo,
      [types.MOVE_TO]: this.prependRequest,
      [types.IMPORT_LIST]: this.importListRequest,
      [types.EXPORT_LIST]: this.exportListRequest,
      [types.ADD_OR_OPEN_LIST]: this.addAListRequest,

      [types.PLAN_WEEK]: this.planWeek,

      [types.ERROR]: this.error,
      [types.DATA_CONFLICT]: this.dataConflict,
    };
  }

  listOfListsRequest(state) {
    return {
      ...state,
      status_msg: 'Loading lists ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  alistRequest(state) {
    return {
      ...state,
      status_msg: 'Loading list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  planWeek(state) {
    return {
      ...state,
      status_msg: 'Planing a week ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  removeListRequest(state) {
    return {
      ...state,
      status_msg: 'Removing list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  importListRequest(state) {
    return {
      ...state,
      status_msg: 'Adding a list on top ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  exportListRequest(state) {
    return {
      ...state,
      status_msg: 'Exporting to a list ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  prependRequest(state) {
    return {
      ...state,
      status_msg: 'Adding on top ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  addAListRequest(state) {
    return {
      ...state,
      status_msg: 'Checking lists ...',
      mode: CONST.mode.MODE_LOADING,
    };
  }

  checkAList(state) {
    return {
      ...state,
      status_msg: 'Checking a list ...',
    };
  }

  listSaved(state) {
    return {
      ...state,
      status_msg: 'List saved',
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
      status_msg: 'Lists loaded',
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
      status_msg: action.payload.name + ' loaded',
      mode: CONST.mode.MODE_A_LIST,
      a_list: action.payload,
    };
  }

  moveTo(state, action) {
    return {
      ...state,
      status_msg: 'Move task to ... ',
      mode: CONST.mode.MODE_MOVE,
      from_list: action.payload.data.from_list,
      task: action.payload.data.task,
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
      status_msg: date,
      mode: CONST.mode.DATA_CONFLICT,
    };
  }
}

export default new AppReducer().handleActions;