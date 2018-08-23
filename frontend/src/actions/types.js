const types = {
    ADD_OR_OPEN_LIST: null,
    CHECK_AND_SAVE: null,
    DATA_CONFLICT: null,
    PREPEND: null,
    IMPORT_LIST: null,
    EXPORT_LIST: null,
    MOVE_CHOOSE: null,
    MOVE_TO: null,
    COPY_OR_MOVE: null,
    PLAN_WEEK: null,
    REFRESH_LIST: 'async',
    LIST_OF_LISTS: 'async',
    NEW_LIST: 'async',
    REMOVE_LIST: 'async',
    UPDATE_LIST: 'async',
    GET_A_LIST: 'async',
};

Object.keys(types).forEach(key => {
    if (types[key] === 'async') {
        types[key] = {
            all: []
        };
        [ 'REQUEST', 'SUCCESS', 'FAILURE' ].forEach(type => {
            const full_type = `${key}_${type}`;
            types[key][type] = full_type;
            types[key].all.push(full_type);
        });
    } else if (types[key] === null) {
        types[key] = key;
    } else {
        throw new Error('type value must be "async" or null');
    }
});

export default types;
