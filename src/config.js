var CONFIG = {
    apiHost: 'http://localhost:5000/',
    // apiHost: 'http://akvaratododb.herokuapp.com/',
    separatorString: "............",
    listAddon: "lists/",
    listsAddon: "lists",
    maxTaskLength: 50,
    loadingStringLength: 40,
    user: {
        id: '1',
        name: 'akvara',
        settings: {}
    },
    settingsConfig: {
        addNewAt: {explain: 'Add new item at position', handler: 'numeric', default: 6, min: 1, max: 10},
        postponeBy: {explain: 'Postpone task by', default: 10, handler: 'numeric', min: 1, max: 50},
        displayListLength: {explain: 'Display numer of tasks at once', default: 6, handler: 'numeric', min: 1, max: 50},
        displayLast: {explain: 'Display number of tasks at bottom',  default: 3, handler: 'numeric', min: 1, max: 50},
        loadListIfExists: {explain: 'Load this list on start', handler: 'selector', field: ''},
    },
    version: '0314'
};

export default Object.freeze(CONFIG);
