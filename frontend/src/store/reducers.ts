import { combineReducers } from 'redux';

import AppReducer from './app/app.reducer';
import { AppState } from './app/app.reducer';

export interface RootState {
  app: AppState,
}

export default combineReducers({
  app: AppReducer,
});
