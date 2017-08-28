import React, { Component } from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import Loading from './Loading';
import TestButtons from './TestButtons';

import CONFIG from '../config.js';

class App extends Component {

    /* The Renderer */
    render() {
        const {store} = this.props;
        console.log('****APPS store:', store);
        return (
            <TestButtons store={store}/>
        )
    }
}

export default connect()(App);