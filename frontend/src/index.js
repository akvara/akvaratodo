import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
// import {createLogger} from 'redux-logger';
import {Provider} from 'react-redux';
import {buildStore} from './store/store';
import CONFIG from './config.js';

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

const renderRoot = Component => ReactDOM.render(
    <Provider store={store}>
        <App
            store={store}
            openAtStartup={CONFIG.user.settings.openListIfExists}
        />
    </Provider>, document.getElementById('app')
);
renderRoot(App);

// ReactDOM.render(<App openAtStartup={CONFIG.user.settings.openListIfExists}/>, document.getElementById('app'));
