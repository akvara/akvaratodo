import { actionCreatorFactory } from 'typescript-fsa';

import reduxConfig from '../config';

const actionCreator = actionCreatorFactory(reduxConfig.appName + '/status');

export const setStatusMessage = actionCreator<string>('SET_STATUS_MESSAGE');
