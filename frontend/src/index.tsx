import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CONFIG from './config.js';
import App from './routes/AppContainer';
import Status from './components/Status';
import User from './components/User';
import { buildStore } from './store/store';

window.onbeforeunload = function() {
  return 'Do you really want to leave ToDo app?';
  // if we return nothing here (just calling return;) then there will be no pop-up question at all
  // return;
};

const store = buildStore([]);

ReactDOM.render(
  <Provider store={store}>
    <App />
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
