import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

import { RootState } from '../reducers';
import { TodoList } from '../types';
import { filterByString } from '../../utils/filterUtils';
import { Forms } from '../forms';

export const getListOfLists = (state: RootState): TodoList[] => state.app.lists;
export const getAList = (state: RootState): TodoList => state.app.aList;
export const getMutableLists = (state: RootState): TodoList[] =>
  state.app.lists.filter((item: TodoList) => !item.immutable);
export const getImmutableLists = (state: RootState): TodoList[] =>
  state.app.lists.filter((item: TodoList) => item.immutable);
export const getExportables = (state: RootState): TodoList[] =>
  state.app.lists.filter((item) => item._id !== state.app.aList._id && !item.immutable).slice(0, 20);
export const getFilteredListOfLists = createSelector(
  [getMutableLists, getFormValues(Forms.listsFilter)],
  (listOfLists, filterForm: any): TodoList[] =>
    filterForm ? listOfLists.filter((list) => filterByString(list.name, filterForm.searchInput)) : listOfLists,
);
