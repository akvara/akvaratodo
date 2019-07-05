import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

import { RootState } from '../reducers';
import { TodoList } from '../types';
import { filterByString } from '../../utils/filterUtils';
import { Forms } from '../forms';

export const getSelectedTask = (state: RootState): string => state.app.task;
