var CONFIG = {
    apiHost: 'http://localhost:5000/',
    // apiHost: 'http://akvaratododb.herokuapp.com/',
    separatorString: "..................",
    listsAddon: "lists",
    settingsAddon: "settings",
    maxTaskLength: 50,
    loadingStringLength: 40,
    user: {
        id: 1,
        name: 'akvara',
        settings: {
            loadListIfExists: "Current",
            addNewAt: 3,
            postponeBy: 11,
            displayListLength: 18,
            displayLast: 3
        }
    },
    settingsConfig: {
        addNewAt: {explain: 'Add new item at position', handler: 'numeric', default: 5, min: 1, max: 10},
        postponeBy: {explain: 'Postpone task by', default: 11, handler: 'numeric', min: 1, max: 50},
        displayListLength: {explain: 'Display numer of tasks at once', default: 17, handler: 'numeric', min: 1, max: 50},
        displayLast: {explain: 'Display number of tasks at bottom',  default: 3, handler: 'numeric', min: 1, max: 50},
        loadListIfExists: {explain: 'Load this list on start', handler: 'selector', field: ''},
    },
    version: '0316-15'
};

export default Object.freeze(CONFIG);
