import combineReducers from '../reducers';
import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import RootSaga from '../sagas';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore(middlewares) {
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [sagaMiddleware, thunk, ...middlewares];
    // middleware.push(authMiddleware);
    // middleware.push(createLogger());

    return {
        ...createStore(combineReducers,
            composeEnhancers(applyMiddleware(...middleware))),
        runSaga: sagaMiddleware.run
    };
}

export function buildStore(middlewares) {
    const store = configureStore(middlewares);
    store.runSaga(RootSaga);
    return store;
}
