import React, { Component } from 'react';
import CONFIG from '../config.js';
import * as Utils from '../utils/utils.js';
import PropTypes from 'prop-types';

class TasksDoneList extends Component {

    static propTypes = {
        items: PropTypes.array.isRequired,
        expand: PropTypes.bool
    };

    undone = (i) => {
        this.props.undone(i);
    };

    displayTask = (task, i) => {
        if (!this.props.expand && i < this.props.items.length - CONFIG.user.settings.displayDoneLength) return null;
        return (
            <tr key={'tr'+i}>
                <td>
                    <span className="glyphicon glyphicon-ok action-button"
                          aria-hidden="true"
                          onClick={this.undone}>
                    </span>
                    <span className="list-item task done">
                        {task}
                    </span>
                </td>
            </tr>
        );
    };

    /* The Renderer */
    render = () => {
        return (
            <div>
            {!this.props.expand && Utils.overLength("displayDoneLength", this.props.items) &&
                CONFIG.separatorString
            }
            <table className="table table-sm table-condensed table-hover">
                <tbody>
                    { this.props.items.map(this.displayTask) }
                </tbody>
            </table>
            </div>
        );
    };
};

export default TasksDoneList;
