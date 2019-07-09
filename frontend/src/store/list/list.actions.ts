import { actionCreatorFactory } from 'typescript-fsa';

import reduxConfig from '../config';
import { TodoList } from '../types';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/list');

export const newListAction = actionCreator.async<{}, any>('NEW_LIST');
export const updateListAction = actionCreator.async<{}, any>('UPDATE_LIST');
export const refreshListAction = actionCreator.async<any, {}>('REFRESH_LIST');
// New, correct
export const getListOfLists = actionCreator.async<void, TodoList[]>('GET_LIST_OF_LISTS');
export const getAList = actionCreator.async<string, TodoList>('GET_A_LIST');
