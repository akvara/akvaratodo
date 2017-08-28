import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Spinner} from './Spinner.jsx'
import CONST from '../utils/constants.js';
import * as appActions from '../actions/app-actions';
import ListsApp from './ListsApp.jsx'
// import { bindActionCreators } from 'redux';

class App extends Component {
    componentDidMount() {
        console.log('this.props:', this.props);
        if (this.props.mode === undefined) {
            if (this.props.openAtStartup) {

            }
            this.props.dispatch(appActions.init());
         }
    }

    swithcer = () => {
        if (this.props.mode === undefined) {
            return <div className="error">mode undefined!</div>
        }
        if (this.props.mode === CONST.mode.LOADING) {
            return Spinner();
        }
        if (this.props.mode === CONST.mode.LIST_OF_LISTS) {
            console.log('this.props.lists:', this.props.lists);
            return (
                <ListsApp lists={this.props.lists} />
            );
        }

        return (
            <div className="error">Mode {this.props.mode} not impelemented</div>
        )
    }

    /* The Renderer */
    render() {
        return this.swithcer();
    }
}

App.propTypes = {
    mode: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        mode: state.app.mode,
        lists: state.app.lists
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//       formActions:  bindActionCreators(formActions, dispatch),
//     };
// };

export default connect(
    mapStateToProps
)(App);