import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as testActions from '../actions/test-actions';
import * as listActions from '../actions/list-actions';
import { bindActionCreators } from 'redux';

class TestButtons extends Component {

    render() {
        return (
            <div>
                <button onClick={() => this.props.actions.test_async()}>Test Async</button>
                <button onClick={() => this.props.actions.test_sync()}>Test sync</button>
                <br />
                <button onClick={() => this.props.actions.getListOfLists()}>Lists</button>
                <button onClick={() => this.props.actions.getAList()}>A list</button>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        test: state.test
    };
}, (dispatch) => {
    let actionsCombined = {...testActions}
    Object.assign(actionsCombined, {...listActions});
    return {
        actions: bindActionCreators({
           ...actionsCombined
        }, dispatch),
        dispatch
    };
})(TestButtons);