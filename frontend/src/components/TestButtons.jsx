import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionToPromise} from 'simple-redux-utils'
// import {test_async, test_sync} from '../actions/test-actions'
import * as testActions from '../actions/test-actions';

import { bindActionCreators } from 'redux';

class TestButtons extends Component {

    render() {
        console.log('props', this.props);
        console.log('store', this.props.store);

        return (
            <div>
                <button onClick={() => this.props.actions.test_async() }>Test Async</button>
                <button onClick={() => this.props.actions.test_sync()}>Test sync</button>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        test: state.test
    };
}, (dispatch) => {
    return {
        actions: bindActionCreators({
            ...testActions
        }, dispatch),
        dispatch
    };
})(TestButtons);