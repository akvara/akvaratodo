import { createReducer } from '../utils/frontend.utils';
import { statusActions } from '../actions';
import { setStatusMessage } from './status.actions';

export type StatusState = {
  message: string;
};

export const initialState: StatusState = {
  message: 'Hello!',
};

const statusReducer = createReducer(initialState, {
  [setStatusMessage.type]: (state: StatusState, action: ReturnType<typeof statusActions.setStatusMessage>) => {
    return {
      ...state,
      message: action.payload,
    };
  },
});

export default statusReducer;
