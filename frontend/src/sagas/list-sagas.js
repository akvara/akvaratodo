import {takeEvery, put} from 'redux-saga/effects';
import {renderComponent} from '../components/Renderer'
// import {push} from 'react-router-redux';
// import {getCurrentUser} from '../actions/user-actions';
// import {handleFormSubmit, fetchItemSaga} from './common-sagas';
import types from '../actions/types';

export function* loading(action) {
    yield renderComponent('loading');
}

// function* getCurrentUserSaga() {
//     yield fetchItemSaga('/api/user/', types.GET_CURRENT_USER);
// }

// function* loginSuccess() {
//     yield put(getCurrentUser());
//     yield put(push('/app/'));
// }

// function* logoutSaga() {
//     yield put(push('/login/'));
// }

export default function* userSagas() {
    yield [
        takeEvery(types.LOADING, loading),
        // takeEvery(types.LOGIN.SUCCESS, loginSuccess),
        // takeEvery(types.GET_CURRENT_USER.REQUEST, getCurrentUserSaga),
        // takeLatest(types.LOGOUT, logoutSaga),
    ];
}
