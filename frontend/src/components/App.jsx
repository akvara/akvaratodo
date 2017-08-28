import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Spinner} from './Spinner.jsx'
import CONST from '../utils/constants.js';
import * as listActions from '../actions/list-actions';
import ListsApp from './ListsApp.jsx'
import TasksApp from './TasksApp.jsx'

class App extends Component {
    componentDidMount() {
        console.log('this.props:', this.props);
        if (this.props.mode === undefined) {
            if (this.props.openAtStartup) {

            }
            // this.props.dispatch(appActions.init());
            this.props.dispatch(listActions.getListOfLists());
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
            return <ListsApp lists={this.props.lists} />
        }

        if (this.props.mode === CONST.mode.A_LIST) {
            console.log('APP this.props:', this.props);
            console.log('APP .a_list:', this.props.a_list);
            return <TasksApp list={this.props.a_list} />
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
        lists: state.app.lists,
        a_list: state.app.a_list
    };
};

export default connect(
    mapStateToProps
)(App);