import { Action } from 'typescript-fsa';
import * as dotProp from 'dot-prop-immutable';

import { setSelectedList } from './selected.actions';
import { createReducer } from '../../utils/frontend.utils';

export type SelectedState = {
  readonly listId: string | null;
};

export const initialState: SelectedState = {
  listId: null,
};

const selectedReducer = createReducer(initialState, {
  [setSelectedList.type]: (state: SelectedState, action: Action<number | null>) =>
    dotProp.set(state, 'listId', action.payload),
});

export default selectedReducer;
