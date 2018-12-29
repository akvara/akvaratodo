import { actionCreatorFactory } from 'typescript-fsa';
import reduxConfig from '../config';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/app');

// Local
export const addOrOpenListByNameAction = actionCreator<any>('ADD_OR_OPEN_LIST');
export const moveInitiationAction = actionCreator<{}>('MOVE_INITIATED');
export const moveToListByNameAction = actionCreator<{}>('MOVE_BY_NAME');
export const moveToListAction = actionCreator<{}>('MOVE_TO');
export const importListAction = actionCreator<any>('IMPORT_LIST');
export const exportListAction = actionCreator<any>('EXPORT_LIST');
export const copyToListAction = actionCreator<any>('COPY_TO');
export const checkAndSaveAction = actionCreator<{}>('CHECK_AND_SAVE');
export const planWeekAction = actionCreator<any>('PLAN_WEEK');
export const dataConflictAction = actionCreator<{}>('DATA_CONFLICT');
export const errorAction = actionCreator<{}>('ERROR');
