import React, { Component } from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import Loading from './Loading';
import CONFIG from '../config.js';

class App extends Component {

    /* The Renderer */
    render() {
        // if
        let {store} = this.props;
        // const {state} = this.props.store
        // console.log('****APPS store:', store);
        // console.log('****APPS this.props.store:', this.props.store);
        console.log('****APPS props:', this.props);
        console.log('****APPS props.store:', this.props.store);
        console.log('****APPS props.store.loading:', this.props.store.loading);
        console.log('****APPS store:', store);
        // console.log('****APPS props:', props);
        // console.log('****APPS STATE:', state);
        let msg = 'NOT loading'
        if (this.props.store.loading) {
            console.log('loading!!!:');
            msg = "Loading ..."
        }
        return (
            <div>
            App: { msg }
            </div>
        )
    }
}

export default connect((state) => {
    return {
        app: state.app,
        loading: state.app.loading
    };
})(App);