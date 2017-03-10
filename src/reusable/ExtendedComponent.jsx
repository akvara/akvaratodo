import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import config from '../config.js';
import DummyComponent from './DummyComponent';


class ExtendedComponent extends DummyComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            b: 22
        }

console.log('ExtendedComponent constructor');
    }

    componentWillMount() {
console.log('ExtendedComponent Will Mount');
    }

    componentDidMount() {
console.log('ExtendedComponent Did Mount');
    }

    componentWillUnmount() {
console.log('ExtendedComponent Did Un');
    }

    render() {
console.log('ExtendedComponent render');
        return null;
    }
}

export default ExtendedComponent;
