import React from 'react';
import ReactDOM from 'react-dom';
// import Loading from './Loading';
import CONFIG from '../config.js';

export function renderComponent(componentName) {
    console.log('will render componentName', componentName);
    ReactDOM.render(React.createElement(componentName),  CONFIG.appNode)
}
