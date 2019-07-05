import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import AppReducer from './app/app.reducer';
import { AppState } from './app/app.reducer';

export interface RootState {
  app: AppState,
  form: any;
}

export default combineReducers({
  app: AppReducer,
  form: formReducer,
});
