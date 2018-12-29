import BaseReducer from './base-reducer';
import CONST from '../../utils/constants.js';
import * as Utils from '../../utils/utils';
import * as listActions from '../../store/actions/list-actions';
import * as appActions from '../../store/actions/app-actions';

class AppReducer extends BaseReducer {
  constructor() {
    super();
    this.initialState = {};
    this.ACTION_HANDLERS = {
      [listActions.getListOfListsAction.started]: this.listOfListsRequest,
      [listActions.getListOfListsAction.done]: this.listOfListsFetched,
      [listActions.refreshListAction.done]: this.listOfListsRefreshed,

      [listActions.removeListAction.started]: this.removeListRequest,
      [listActions.updateListAction.done]: this.listSaved,

      [listActions.getAListAction.started]: this.getAListRequest,
      [listActions.getAListAction.done]: this.aListFetched,

      [appActions.addOrOpenListAction]: this.addAListRequest,
      [appActions.checkAndSaveAction]: this.checkAList,
      [appActions.moveInitiationAction]: this.moveTo,
      [appActions.moveToListAction]: this.prependRequest,
      [appActions.importListAction]: this.importListRequest,
      [appActions.exportListAction]: this.exportListRequest,

      [appActions.planWeekAction]: this.planWeek,

      [appActions.errorAction]: this.error,
      [appActions.dataConflictAction]: this.dataConflict,
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
