import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

import { RootState } from '../reducers';
import { TodoList } from '../types';
import { filterByString } from '../../utils/filterUtils';
import { Forms } from '../forms';
import { getPreviousDays } from '../../utils/stringUtils';

export const selectListOfLists = (state: RootState): TodoList[] => state.app.lists;
export const selectAListById = (listId: string) => (state: RootState): TodoList | null =>
  state.app.lists.find((list) => list._id === listId) || null;
export const selectAList = (state: RootState): TodoList => state.app.aList;
export const selectMutableLists = (state: RootState): TodoList[] =>
  state.app.lists.filter((item: TodoList) => !item.immutable);
export const selectImmutableLists = (state: RootState): TodoList[] =>
  state.app.lists.filter((item: TodoList) => item.immutable);
export const selectExportables = (state: RootState): TodoList[] =>
  state.app.lists.filter((item) => item._id !== state.app.aList._id && !item.immutable).slice(0, 20);
export const getFilteredListOfLists = createSelector(
  [selectMutableLists, getFormValues(Forms.listsFilter)],
  (listOfLists, filterForm: any): TodoList[] =>
    filterForm ? listOfLists.filter((list) => filterByString(list.name, filterForm.searchInput)) : listOfLists,
);

const prevDays = getPreviousDays();

export const findLegacyExists = (state: RootState): boolean =>
  state.app.lists.some((aList) => prevDays.includes(aList.name));
