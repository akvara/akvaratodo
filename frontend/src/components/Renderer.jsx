import React from 'react';
import ReactDOM from 'react-dom';
import CONFIG from '../config.js';

export function renderComponent(componentName, store) {
    console.log('will render componentName', componentName);
    ReactDOM.render(React.createElement(componentName),  CONFIG.appNode)
}
