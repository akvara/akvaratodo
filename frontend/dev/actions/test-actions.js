import types from './types';

export function test_async(data, resolve, reject) {
    console.log('test_async clicked, data:', data);

    return {
        type: types.TEST_ASYNC.REQUEST, payload: {data, resolve, reject}
    };
}

export function test_sync() {
    console.log('test_sync clicked');

    return {
        type: types.TEST_SYNC
    };
}
