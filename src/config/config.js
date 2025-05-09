export const config = {
  devHost: 'https://akvaratodo-flask-api.herokuapp.com/',
  // devHost: 'http://localhost:5000/',
  // apiHost: 'https://akvaratododb.herokuapp.com/',
  apiHost: 'https://akvaratodo-flask-api.herokuapp.com/',
  separatorString: '..................',
  listsAddon: 'lists',
  settingsAddon: 'settings',
  user: {
    id: 1,
    name: 'akvara',
    settings: {
      openListIfExists: 'Current',
      addNewAt: 4,
      displayListLength: 15,
      displayDoneLength: 3,
      displayLast: 2,
    },
  },
  statusNode: document.getElementById('status'),
  userNode: document.getElementById('user'),
  appNode: document.getElementById('app'),
  footerNode: document.getElementById('footer'),
  clickSound: 'https://www.soundjay.com/buttons/button-20.mp3',
  version: '0330-10',
};

export default config;
