import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import CONFIG from './config.js';
import {Provider} from 'react-redux';
import {buildStore} from './store/store';

console.log('Starting App ...');

window.onbeforeunload = function() {
   return "Do you really want to leave ToDo app?";
   //if we return nothing here (just calling return;) then there will be no pop-up question at all
   //return;
};

const store = buildStore([]);

// const renderRoot = Component => ReactDOM.render(
//     <Provider store={store}>
//         <AppContainer>
//             <Component store={store}/>
//         </AppContainer>
//     </Provider>, document.getElementById('app')
// );

// renderRoot(App);

ReactDOM.render(<App openAtStartup={CONFIG.user.settings.openListIfExists}/>, document.getElementById('app'));
