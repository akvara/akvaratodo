import { getFormValues } from 'redux-form';

import { RootState } from '../reducers';
import { ListCreds } from '../types';

export const getSelectedTask = (state: RootState): string => state.app.task;
export const getCurrentMode = (state: RootState): string => state.app.mode;
// ToDo: Move to Selected
export const getPreviousList = (state: RootState): ListCreds | null =>
  state.app.fromList && state.app.aList._id === state.app.fromList.listId ? null : state.app.fromList;
