var CONFIG = {
    apiHost: 'http://akvaratododb.herokuapp.com/',
    // devHost: 'http://akvaratododb.herokuapp.com/',
    devHost: 'http://localhost:5000/',
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
            displayListLength: 17,
            displayDoneLength: 3,
            displayLast: 2
        }
    },
    settingsConfig: {
        addNewAt: {explain: 'Add new item at position', handler: 'numeric', default: 5, min: 1, max: 10},
        displayListLength: {explain: 'Display numer of tasks at once', default: 17, handler: 'numeric', min: 1, max: 50},
        displayLast: {explain: 'Display number of tasks at bottom',  default: 3, handler: 'numeric', min: 1, max: 50},
        displayDoneLength: {explain: 'Display numer of done tasks', default: 3, handler: 'numeric', min: 1, max: 50},
        loadListIfExists: {explain: 'Load this list on start', handler: 'selector', field: ''},
    },
    version: '0320-15'
};

export default Object.freeze(CONFIG);
