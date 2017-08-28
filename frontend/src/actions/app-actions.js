import types from './types';

export function init() {
    return {type: types.INIT, payload: {}};
}
