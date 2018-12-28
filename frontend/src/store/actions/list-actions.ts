import { actionCreatorFactory } from 'typescript-fsa';
import reduxConfig from '../config';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/lists');

// Async
export const getListOfLists = actionCreator.async<{}, any>('LIST_OF_LISTS');
export const getAListAction = actionCreator.async<{}, any>('GET_A_LIST');
export const newListAction = actionCreator.async<{}, any>('NEW_LIST');
export const updateListAction = actionCreator.async<{}, any>('UPDATE_LIST');
export const removeListAction = actionCreator.async<{}, any>('REMOVE_LIST');

// Local
export const addOrOpenListAction = actionCreator<any>('ADD_OR_OPEN_LIST');
export const moveInitiationAction = actionCreator<{}>('MOVE_CHOOSE');
export const copyOrMoveToNewListAction = actionCreator<{}>('COPY_OR_MOVE');
export const moveToListAction = actionCreator<{}>('MOVE_TO');
export const importListAction = actionCreator<any>('IMPORT_LIST');
export const exportListAction = actionCreator<any>('EXPORT_LIST');
export const prependToAListAction = actionCreator<{}>('PREPEND');
export const checkAndSaveAction = actionCreator<{}>('CHECK_AND_SAVE');
export const planWeekAction = actionCreator<any>('PLAN_WEEK');
export const error = actionCreator<{}>('ERROR');
