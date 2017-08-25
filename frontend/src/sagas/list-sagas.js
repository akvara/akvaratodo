import {takeEvery, takeLatest} from 'redux-saga';
import {put} from 'redux-saga/effects';
// import {push} from 'react-router-redux';
// import {getCurrentUser} from '../actions/user-actions';
// import {handleFormSubmit, fetchItemSaga} from './common-sagas';
import types from '../actions/types';

// export function* loginSaga(action) {
//     yield handleFormSubmit('/api/auth/', action, types.LOGIN);
// }

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
        // takeEvery(types.LOGIN.REQUEST, loginSaga),
        // takeEvery(types.LOGIN.SUCCESS, loginSuccess),
        // takeEvery(types.GET_CURRENT_USER.REQUEST, getCurrentUserSaga),
        // takeLatest(types.LOGOUT, logoutSaga),
    ];
}
