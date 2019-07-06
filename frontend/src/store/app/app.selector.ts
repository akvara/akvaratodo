import { getFormValues } from 'redux-form';

import { RootState } from '../reducers';

export const getSelectedTask = (state: RootState): string => state.app.task;
export const getCurrentMode = (state: RootState): string => state.app.mode;
