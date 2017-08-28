import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {buildStore} from './store/store';
import CONFIG from './config.js';
import App from './components/App';
import Status from './components/Status';
import User from './components/User';
import TestButtons from './components/TestButtons';
// import {createLogger} from 'redux-logger';

console.log('Starting App ...');

window.onbeforeunload = function() {
   return "Do you really want to leave ToDo app?";
   //if we return nothing here (just calling return;) then there will be no pop-up question at all
   //return;
};

let middleware = [];

if (window.devToolsExtension) {
    console.log('window.devToolsExtension is used: no Redux spam in console.');
} else {
    // middleware.push(createLogger());
}

const store = buildStore(middleware);

// const renderRoot = () => {
  ReactDOM.render(
    <Provider store={store}>
        <App
            store={store}
            openAtStartup={CONFIG.user.settings.openListIfExists}
        />
    </Provider>, CONFIG.appNode
  );
  ReactDOM.render(
    <Provider store={store}>
        <TestButtons store={store}/>
    </Provider>, CONFIG.footerNode
  );
  ReactDOM.render(
    <Provider store={store}>
        <Status store={store}/>
    </Provider>, CONFIG.statusNode
  );
  ReactDOM.render(
    <Provider store={store}>
        <User store={store}/>
    </Provider>, CONFIG.userNode
  );
// }

// renderRoot();

// ReactDOM.render(<App openAtStartup={CONFIG.user.settings.openListIfExists}/>, document.getElementById('app'));
