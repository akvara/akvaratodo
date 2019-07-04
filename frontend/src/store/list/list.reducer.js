import BaseReducer from '../utils/base-reducer';
import CONST from '../../utils/constants.js';
import * as Utils from '../../utils/utils';
import * as listActions from './list.actions';
import * as appActions from '../app/app.actions';

class AppReducer extends BaseReducer {
  constructor() {
    super();
    this.initialState = {};
    this.ACTION_HANDLERS = {
      [listActions.getListOfListsAction.started.type]: this.listOfListsRequestSaga,
      [listActions.getListOfListsAction.done.type]: this.listOfListsFetched,
      [listActions.refreshListAction.done.type]: this.listOfListsRefreshed,

      [listActions.removeListAction.started.type]: this.removeListRequest,
      [listActions.updateListAction.done.type]: this.listSaved,

      [listActions.getAListAction.started.type]: this.getAListRequest,
      [listActions.getAListAction.done.type]: this.aListFetched,

      [appActions.addOrOpenListByNameAction.type]: this.addAListRequest,
      [appActions.checkAndSaveAction.type]: this.checkAList,
      [appActions.moveInitiationAction.type]: this.moveTo,
      [appActions.moveToListAction.type]: this.prependRequest,
      [appActions.importListAction.type]: this.importListRequest,
      [appActions.exportListAction.type]: this.exportListRequest,

      [appActions.planWeekAction.type]: this.planWeek,

      [appActions.errorAction.type]: this.error,
      [appActions.dataConflictAction.type]: this.dataConflict,
    };
  }

  listOfListsRequestSaga(state) {
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
