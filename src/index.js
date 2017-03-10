import React from 'react';
import ReactDOM from 'react-dom';
import ExtendedComponent from './reusable/ExtendedComponent';

console.log('Starting ExtendedComponent ...');

ReactDOM.render(
    <ExtendedComponent />,
    document.getElementById('app')
);

