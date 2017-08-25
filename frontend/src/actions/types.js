const types = {
    CHANGE_LANGUAGE: null,
    GET_PAGE: 'async',

    //User
    REGISTER: 'async',
    LOGIN: 'async',
    LOGOUT: null,
    VERIFY_USER: 'async',
    GET_CURRENT_USER: 'async',

    //FAQ
    GET_FAQS: 'async',

    //Debt-holders
    SAVE_NEW_DEBT_HOLDER: 'async',
    REQUIRE_DEBT_HOLDER: null,

    //Debts
    GET_DEBTS: 'async',
    SAVE_NEW_DEBT: 'async',
    SAVE_DEBT: 'async',
    GET_DEBT: 'async',

    //Plans
    GET_PLANS: 'async'
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
