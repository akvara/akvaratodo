import { actionCreatorFactory } from 'typescript-fsa';
import reduxConfig from '../config';
import { ListNameOnly, TodoListCopy, TodoListImpEx, TodoListMove, TodoListMoveByName } from '../types';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/app');

// Local
export const addOrOpenListByNameAction = actionCreator<ListNameOnly>('ADD_OR_OPEN_LIST');
export const moveInitiationAction = actionCreator<{}>('MOVE_INITIATED');
export const moveToListByNameAction = actionCreator<TodoListMoveByName>('MOVE_BY_NAME');
export const moveToListAction = actionCreator<TodoListMove>('MOVE_TO');
export const copyToListAction = actionCreator<TodoListCopy>('COPY_TO');
export const importListAction = actionCreator<TodoListImpEx>('IMPORT_LIST');
export const exportListAction = actionCreator<TodoListImpEx>('EXPORT_LIST');
export const checkAndSaveAction = actionCreator<{}>('CHECK_AND_SAVE');
export const planWeekAction = actionCreator<{}>('PLAN_WEEK');
export const dataConflictAction = actionCreator<{}>('DATA_CONFLICT');
export const errorAction = actionCreator<{}>('ERROR');
