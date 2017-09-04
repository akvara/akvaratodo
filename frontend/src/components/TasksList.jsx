import React, { Component } from 'react';
import CONFIG from '../config.js';
import * as Utils from '../utils/utils.js';
import PropTypes from 'prop-types';

class TaskList extends Component {

    static propTypes = {
        items: PropTypes.array.isRequired,
        done: PropTypes.func.isRequired,
        delete: PropTypes.func.isRequired,
        toTop: PropTypes.func.isRequired,
        move: PropTypes.func.isRequired,
        procrastinate: PropTypes.func.isRequired,
        postpone: PropTypes.func.isRequired,
        openListByName: PropTypes.func.isRequired,
        hightlightIndex: PropTypes.number,

    };

    done(i) {
        this.props.done(i);
    }

    delete(i) {
        this.props.delete(i);
    }

    toTop(i) {
        this.props.toTop(i);
    }

    move(i) {
        this.props.move(i);
    }

    procrastinate(i) {
        this.props.procrastinate(i);
    }

    postpone(i) {
        this.props.postpone(i);
    }

    openListByName(name) {
        this.props.openListByName(name);
    }

    hightlightOnDemand(element, index) {
        if (this.props.hightlightIndex === index)
            return <strong>{element}</strong>;
        else
            return <span>{element}</span>;
    }

    processTaskText(task) {
        if (task === null) task = 'null';
        let taskTruncated = task.substring(0, CONFIG.maxTaskLength),
            taskAsDisplayed = taskTruncated;

        /* If task is a link: */
        if (task.substring(0, 4) === "http") {
            taskTruncated = taskTruncated.substr(taskTruncated.indexOf('://')+3);
            if (taskTruncated[taskTruncated.length-1] === "/") {
                taskTruncated = taskTruncated.substr(0, taskTruncated.length-1);
            }
            taskAsDisplayed = <a href={ task } target="_blank">{ taskTruncated }</a>;
            return taskAsDisplayed;
        }

        /* if task is a folder: */
        if (task.substring(0, 1) === "[") {
            taskAsDisplayed = <span>
                <span className={"glyphicon glyphicon-folder-open list-first-item"}
                      aria-hidden="true"
                      onClick={this.openListByName.bind(this, task.substring(1))}>
                </span>
                { taskTruncated.substring(1) }
            </span> ;
        }

        return taskAsDisplayed;
    }

    /* Display one line */
    displayTask(task, i, omitted) {
        if (task === CONFIG.separatorString) {
            return <tr key={'tr'+i}>
                <td>{CONFIG.separatorString}</td>
                <td className="right-align">{CONFIG.separatorString}</td>
            </tr>
        }

        let itemIndex = i;
        if (itemIndex >= CONFIG.user.settings.displayListLength - CONFIG.user.settings.displayLast ) {
            itemIndex = i + omitted;
        }

        let taskAsDisplayed = this.processTaskText(task);

        if (this.props.immutable) {
            return <tr key={'tr'+i}><td>{ taskAsDisplayed }</td></tr>
        } else {
            return <tr key={'tr'+i}>
                <td>
                    <span className="glyphicon glyphicon-unchecked action-button"
                          aria-hidden="true"
                          onClick={this.done.bind(this, itemIndex)}>
                    </span>
                    <span className="list-item task">
                        { this.hightlightOnDemand(taskAsDisplayed, itemIndex) }
                    </span>
                </td>
                <td className="actions">
                    <span className="glyphicon glyphicon-trash delete-button" aria-hidden="true" onClick={this.delete.bind(this, itemIndex)}></span>
                    <span className="list-item">{' '}</span>
                    <span className="glyphicon glyphicon-arrow-down action-button" aria-hidden="true" onClick={this.procrastinate.bind(this, itemIndex)}></span>
                    <span className="glyphicon glyphicon-arrow-up action-button" aria-hidden="true"onClick={this.toTop.bind(this, itemIndex)}></span>
                    <span className="glyphicon glyphicon-random action-button" aria-hidden="true" onClick={this.move.bind(this, itemIndex)}></span>
                    <span className="glyphicon glyphicon-thumbs-down action-button" aria-hidden="true" onClick={this.postpone.bind(this, itemIndex)}></span>
                </td>
            </tr>
        }
    }

    /* The Renderer */
    render() {
        let taskListDisplayed = this.props.items,
            shouldOmit = 0;

        if (!this.props.expand && Utils.overLength("displayListLength", this.props.items)) {
            shouldOmit = this.props.items.length - CONFIG.user.settings.displayListLength;
            taskListDisplayed =
                this.props.items.slice(0, CONFIG.user.settings.displayListLength - CONFIG.user.settings.displayLast - 1)
                    .concat([CONFIG.separatorString])
                    .concat(this.props.items.slice(-CONFIG.user.settings.displayLast));
        }

        return (
            <table className="table table-condensed table-hover">
                <tbody>
                    { taskListDisplayed.map((task, index) => this.displayTask(task, index, shouldOmit)) }
                </tbody>
            </table>
        );
    }
}

export default TaskList;
