import { RootState } from '../reducers';
import { ListCreds } from '../types';

export const selectSelectedTask = (state: RootState): string => state.app.task;
export const selectCurrentMode = (state: RootState): string => state.app.mode;
// ToDo: Move to Selected
export const selectPreviousList = (state: RootState): ListCreds | null =>
  state.app.fromList && state.app.aList._id === state.app.fromList.listId ? null : state.app.fromList;
