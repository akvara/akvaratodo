export default {
    devHost: 'http://akvaratododb.herokuapp.com/',
    // devHost: 'http://localhost:5000/',
    apiHost: 'https://akvaratododb.herokuapp.com/',
    separatorString: '..................',
    listsAddon: 'lists',
    settingsAddon: 'settings',
    maxTaskLength: 50,
    loadingStringLength: 40,
    user: {
        id: 1,
        name: 'akvara',
        settings: {
            openListIfExists: 'Current',
            addNewAt: 4,
            displayListLength: 15,
            displayDoneLength: 3,
            displayLast: 2
        }
    },
    settingsConfig: {
        addNewAt: { explain: 'Add new item at position', handler: 'numeric', default: 5, min: 1, max: 10 },
        displayListLength: {
            explain: 'Display number of tasks at once',
            default: 17,
            handler: 'numeric',
            min: 1,
            max: 50
        },
        displayLast: { explain: 'Display number of tasks at bottom', default: 3, handler: 'numeric', min: 1, max: 50 },
        displayDoneLength: { explain: 'Display number of done tasks', default: 3, handler: 'numeric', min: 1, max: 50 },
        openListIfExists: { explain: 'Load this list on start', handler: 'selector', field: '' },
    },
    statusNode: document.getElementById('status'),
    userNode: document.getElementById('user'),
    appNode: document.getElementById('app'),
    footerNode: document.getElementById('footer'),
    clickSound: 'https://www.soundjay.com/button/button-20.mp3',
    version: '0704-13'
};
