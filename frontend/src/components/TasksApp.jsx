import React, { Component } from 'react';
import TasksDoneList from './TasksDoneList';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as listActions from '../actions/list-actions';
// import {playSound} from '../utils/hotkeys';
// import $ from 'jquery';

class TasksApp extends Component {
    constructor(props, context) {
        super(props, context);

        this.immutables = props.immutables || [];

        this.state = {
            listName: this.props.list.name,
            itemsToDo: [],
            itemsDone: [],
            prepend: props.prepend,
            hightlightIndex: props.prepend ? 0 : null,
            immutable: false,
            task: '',
            notYetLoaded: true,
            reloadNeeded: false,
            expandToDo: false,
            listNameOnEdit: false,
            expandDone: false
        };
    }
        /* The Renderer */
    render() {
        return (
            <div>
                <TasksDoneList
                    items={this.state.itemsDone}
                    undone={this.unDoneTask.bind(this)}
                    expand={this.state.expandDone}
                />
                <hr />
            </div>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
           ...listActions
        }, dispatch),
        dispatch
    };
};

export default connect(
    null,
    mapDispatchToProps
)(TasksApp);