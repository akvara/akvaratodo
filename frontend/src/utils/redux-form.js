import {Promise} from 'es6-promise';
// import {SubmissionError} from 'redux-form';
// import {callPost, callUpdate} from './api';
// import {call} from 'redux-saga/effects';

export const bindActionToPromise = (dispatch, actionCreator) => payload => {
    return new Promise((resolve, reject) => dispatch(actionCreator(payload, resolve, reject)));
};
