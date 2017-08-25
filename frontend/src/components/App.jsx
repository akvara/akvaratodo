import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Loading from './Loading';
import TestButtons from './TestButtons';

import CONFIG from '../config.js';

class App extends Component {

    componentWillMount() {
        const {store} = this.props
        console.log('CONFIG.appNode:', CONFIG.appNode);
        ReactDOM.render(<TestButtons store={store}/>,  CONFIG.appNode)
    }

    /* The Renderer */
    render() {
        return null;
    }
}

export default App;
