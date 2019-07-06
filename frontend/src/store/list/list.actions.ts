import { actionCreatorFactory } from 'typescript-fsa';
import reduxConfig from '../config';
import { TodoList } from '../types';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/list');

export const getListOfListsAction = actionCreator.async<void, {}>('GET_LIST_OF_LISTS_');
export const getAListAction = actionCreator.async<string, {}>('GET_A_LIST');
export const newListAction = actionCreator.async<{}, any>('NEW_LIST');
export const updateListAction = actionCreator.async<{}, any>('UPDATE_LIST');
export const removeListAction = actionCreator.async<{}, any>('REMOVE_LIST');
export const refreshListAction = actionCreator.async<any, {}>('REFRESH_LIST');
// New
export const getListOfLists = actionCreator.async<void, TodoList[]>('GET_LIST_OF_LISTS');
