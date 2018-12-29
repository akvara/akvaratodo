import { actionCreatorFactory } from 'typescript-fsa';
import reduxConfig from '../config';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/lists');

// Async
export const getListOfListsAction = actionCreator.async<{}, any>('GET_LIST_OF_LISTS');
export const getAListAction = actionCreator.async<string, any>('GET_A_LIST');
export const newListAction = actionCreator.async<{}, any>('NEW_LIST');
export const updateListAction = actionCreator.async<{}, any>('UPDATE_LIST');
export const removeListAction = actionCreator.async<{}, any>('REMOVE_LIST');
export const refreshListAction = actionCreator.async<any, {}>('REFRESH_LIST');

// Local
export const addOrOpenListAction = actionCreator<any>('ADD_OR_OPEN_LIST');
export const moveInitiationAction = actionCreator<{}>('MOVE_INTIATED');
export const copyOrMoveToNewListAction = actionCreator<{}>('COPY_OR_MOVE');
export const moveToListAction = actionCreator<{}>('MOVE_TO');
export const importListAction = actionCreator<any>('IMPORT_LIST');
export const exportListAction = actionCreator<any>('EXPORT_LIST');
export const prependToAListAction = actionCreator<{}>('PREPEND');
export const checkAndSaveAction = actionCreator<{}>('CHECK_AND_SAVE');
export const planWeekAction = actionCreator<any>('PLAN_WEEK');
export const dataConflictAction = actionCreator<{}>('DATA_CONFLICT');
export const errorAction = actionCreator<{}>('ERROR');
