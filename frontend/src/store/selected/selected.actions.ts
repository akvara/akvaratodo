import actionCreatorFactory from 'typescript-fsa';
import reduxConfig from '../config';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/selected');

export const setSelectedList = actionCreator<number | null>('SET_SELECTED_LIST');
