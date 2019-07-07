import { formValueSelector } from 'redux-form';
import { createSelector } from 'reselect';

import { RootState } from '../reducers';
import { getListOfLists } from '../list/list.selector';

export const getSelectedListId = (state: RootState): string | null => state.selected.listId || null;

export const getSelectedList = createSelector(
  [getListOfLists, getSelectedListId],
  (listList, selectedListId) => {
    return listList.find((list) => list._id === selectedListId) || {};
  },
);
