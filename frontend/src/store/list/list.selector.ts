import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

import { RootState } from '../reducers';
import { TodoList } from '../types';
import { Forms } from '../forms';
import { filterByString } from '../../utils/filterUtils';
import { getPreviousDays } from '../../utils/stringUtils';

export const selectListOfLists = (state: RootState): TodoList[] => state.app.lists;

export const selectAListById = (listId: string) => (state: RootState): TodoList | null =>
  state.app.lists.find((list) => list.id === listId) || null;

export const selectAList = (state: RootState): TodoList => state.app.aList;

export const selectMutableLists = (state: RootState): TodoList[] =>
  state.app.lists.filter((item: TodoList) => !item.immutable);

export const selectImmutableLists = (state: RootState): TodoList[] =>
  state.app.lists.filter((item: TodoList) => item.immutable);

export const selectExportables = (state: RootState): TodoList[] =>
  state.app.lists.filter((item) => item.id !== state.app.aList.id && !item.immutable).slice(0, 20);

export const getFilteredListOfLists = createSelector(
  [selectMutableLists, getFormValues(Forms.listsFilter)],
  (listOfLists, filterForm: any): TodoList[] =>
    filterForm ? listOfLists.filter((list) => filterByString(list.name, filterForm.searchInput)) : listOfLists,
);

export const findLegacyExists = (state: RootState): boolean =>
  state.app.lists.some((aList) =>  getPreviousDays().includes(aList.name));
