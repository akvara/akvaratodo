const types = {
    TEST_ASYNC: 'async',
    TEST_SYNC: null,

    INIT: null,
    LIST_OF_LISTS: 'async',
    ADD_A_LIST: 'async',
    A_LIST: 'async',
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
