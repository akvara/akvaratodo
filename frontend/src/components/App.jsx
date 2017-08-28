import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Spinner} from './Spinner.jsx'

class App extends Component {
    isLoading = () => {
        if (this.props.store.loading) return "Loading...";
        return 'NOT loading';
    }

    /* The Renderer */
    render() {
        console.log('this.props.loading:', this.props.loading);
        if (this.props.loading) return Spinner();
        return (
            <div>'NOT loading'</div>
        )
    }
}

export default connect((state) => {
    return {
        loading: state.app.loading
    };
})(App);