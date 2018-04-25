import React, {Component} from 'react';
import {connect} from 'react-redux';

class Status extends Component {

    render() {
        return (
            <div>{this.props.status_msg}</div>
        )
    }
}

export default connect(
    (state) => ({
        status_msg: state.app.status_msg
    })
)(Status);