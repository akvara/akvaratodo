import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import combineReducers from './reducers';
import RootSaga from './sagas';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore(middlewares: []) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, thunk, ...middlewares];
  // middleware.push(authMiddleware);
  // middleware.push(createLogger());

  return {
    ...createStore(combineReducers, composeEnhancers(applyMiddleware(...middleware))),
    runSaga: sagaMiddleware.run,
  };
}

export function buildStore(middlewares: []) {
  const store = configureStore(middlewares);
  store.runSaga(RootSaga);
  return store;
}
