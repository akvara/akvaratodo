import { formValueSelector } from 'redux-form';
import { createSelector } from 'reselect';

import { RootState } from '../reducers';
import { getAllLists } from '../list/list.selector';

export const getSelectedListId = (state: RootState): string | null => state.selected.listId || null;

export const getSelectedList = createSelector(
  [getAllLists, getSelectedListId],
  (listList, selectedListId) => {
    return listList.find((list) => list._id === selectedListId) || {};
  },
);
