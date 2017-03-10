import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import config from '../config.js';


class DummyComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            a: 11
        }

console.log('DummyComponent constructor');
    }

    componentWillMount() {
console.log('DummyComponent Will Mount');
    }

    componentDidMount() {
console.log('DummyComponent Did Mount');
    }

    componentWillUnmount() {
console.log('DummyComponent Did Un');
    }

    render() {
console.log('DummyComponent render');
        return null;
    }
}

export default DummyComponent;
