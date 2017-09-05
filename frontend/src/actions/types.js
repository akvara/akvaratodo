const types = {
    LIST_OF_LISTS: 'async',
    ADD_OR_OPEN_LIST: null,
    CHECK_AND_SAVE: null,
    LOOKING_FOR_A_LIST: 'async',
    NEW_LIST: 'async',
    REMOVE_LIST: 'async',
    UPDATE_LIST: 'async',
    GET_A_LIST: 'async',
    CHECK_DATE: 'async',
};

Object.keys(types).forEach(key => {
    if (types[key] === 'async') {
        types[key] = {
            all: []
        };
        ['REQUEST', 'SUCCESS', 'FAILURE'].forEach(type => {
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
