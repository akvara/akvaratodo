import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import AppReducer, { AppState } from './app/app.reducer';
import StatusReducer, { StatusState } from './status/status.reducer';
import selectedReducer, { SelectedState } from './selected/selected.reducer';

export interface RootState {
  app: AppState,
  status: StatusState,
  selected: SelectedState;
  form: any;
}

export default combineReducers({
  app: AppReducer,
  status: StatusReducer,
  selected: selectedReducer,
  form: formReducer,
});
