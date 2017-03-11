import React from 'react';
import ReactDOM from 'react-dom';
import ListApp from './components/ListApp';
import DummyComponent from './reusable/DummyComponent';
import * as Utils from './utils/utils.js';

console.log('Starting ListApp ...');

ReactDOM.render(
    <ListApp />,
    document.getElementById('app')
);
// ReactDOM.render(
//     <DummyComponent />,
//     document.getElementById('app')
// );

