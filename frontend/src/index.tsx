/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { buildStore } from './store/store';
import { createLogger } from 'redux-logger';

import CONFIG from './config.js';
import App from './components/App';
import Status from './components/Status';
import User from './components/User';

window.onbeforeunload = function() {
  return 'Do you really want to leave ToDo app?';
  //if we return nothing here (just calling return;) then there will be no pop-up question at all
  //return;
};

let middleware = [];

if (window.devToolsExtension) {
  console.log('window.devToolsExtension is used: no Redux spam in console.');
} else {
  middleware.push(createLogger());
}
const store = buildStore(middleware);

ReactDOM.render(
  <Provider store={store}>
    <App openAtStartup={CONFIG.user.settings.openListIfExists} />
  </Provider>,
  CONFIG.appNode,
);

ReactDOM.render(
  <Provider store={store}>
    <Status />
  </Provider>,
  CONFIG.statusNode,
);

ReactDOM.render(
  <Provider store={store}>
    <User />
  </Provider>,
  CONFIG.userNode,
);
