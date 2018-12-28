import { actionCreatorFactory } from 'typescript-fsa';
import reduxConfig from '../config';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/list');

export const getListOfLists = actionCreator.async<{}, any>('LIST_OF_LISTS');

export const getAList = actionCreator.async<{}, any>('GET_A_LIST');

export const newList = actionCreator.async<{}, any>('NEW_LIST');

export const removeList = actionCreator.async<{}, any>('REMOVE_LIST');

export const addOrOpenAList = actionCreator<any>('ADD_OR_OPEN_LIST');

export const checkAndSave = actionCreator.async<{}, any>('CHECK_AND_SAVE');

export const prependToAList = actionCreator.async<{}, any>('PREPEND');

export const importList = actionCreator.async<{}, any>('IMPORT_LIST');

export const exportList = actionCreator.async<{}, any>('EXPORT_LIST');

export const moveOutside = actionCreator.async<{}, any>('MOVE_CHOOSE');

export const moveToList = actionCreator.async<{}, any>('MOVE_TO');

export const copyOrMoveToNew = actionCreator.async<{}, any>('COPY_OR_MOVE');

export const planWeek = actionCreator<any>('PLAN_WEEK');

export const error = actionCreator.async<{}, any>('ERROR');
