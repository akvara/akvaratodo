import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

import { RootState } from '../reducers';
import { TodoList } from '../types';
import { filterByString } from '../../utils/filterUtils';
import { Forms } from '../forms';

export const getAllLists = (state: RootState): TodoList[] => state.app.lists;
export const getMutableLists = (state: RootState): TodoList[] => state.app.lists.filter((item: TodoList) => !item.immutable);

// export const getSortedPersonList = (state: RootState): PersonState => {
//   const lists = [...state.persons];
//   return persons.sort((a, b) => a.name.localeCompare(b.name, 'lt', { sensitivity: 'base' }));
// };

export const getFilteredListOfLists = createSelector(
  [getMutableLists, getFormValues(Forms.listsFilter)],
  (listOfLists, filterForm: any): TodoList[] =>
    filterForm ? listOfLists.filter((list) => filterByString(list.name, filterForm.searchInput)) : listOfLists,
);
