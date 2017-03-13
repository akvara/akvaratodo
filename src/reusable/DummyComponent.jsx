import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import config from '../config.js';
import * as Utils from '../utils/utils.js';

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

    componentWillUpdate() {
console.log('DummyComponent Will Update');
    }

    componentDidUpdate() {
console.log('DummyComponent Did Update');
    }

    parentUpdateState() {
        this.setState({
            a: this.state.a + 1,
            b: this.state.b + 1
        })
    }

    callbackCaller(callback) {
        callback();
    }

    render() {
console.log('DummyComponent render');
        return null;
    }
}

export default DummyComponent;
