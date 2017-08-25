import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import config from '../config.js';
import DummyComponent from './DummyComponent';


class ExtendedComponent extends DummyComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            a: 11,
            b: 22
        }

console.log('ExtendedComponent constructor');
    }

    componentWillMount() {
console.log('ExtendedComponent Will Mount');
        console.log('this.state.a', this.state.a);
        console.log('this.state.b', this.state.b);

        this.callbackCaller(this.parentUpdateState.bind(this));
    }

    componentDidMount() {
console.log('ExtendedComponent Did Mount');
    }

    componentWillUnmount() {
console.log('ExtendedComponent Did Un');
    }

    render() {
console.log('ExtendedComponent render');
        console.log('this.state.a', this.state.a);
        console.log('this.state.b', this.state.b);
        
        return null;
    }
}

export default ExtendedComponent;
