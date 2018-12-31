import { actionCreatorFactory } from 'typescript-fsa';
import reduxConfig from '../config';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/list');

// Async
export const getListOfListsAction = actionCreator.async<void, {}>('GET_LIST_OF_LISTS');
export const getAListAction = actionCreator.async<string, {}>('GET_A_LIST');
export const newListAction = actionCreator.async<{}, any>('NEW_LIST');
export const updateListAction = actionCreator.async<{}, any>('UPDATE_LIST');
export const removeListAction = actionCreator.async<{}, any>('REMOVE_LIST');
export const refreshListAction = actionCreator.async<any, {}>('REFRESH_LIST');
