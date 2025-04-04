import * as React from 'react';
import PropTypes from 'prop-types';

import CONFIG from '../config/config.js';
import * as Utils from '../utils/utils.js';
import { restrictions } from '../config/constants';

class TaskList extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    done: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    toTop: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    procrastinate: PropTypes.func.isRequired,
    postpone: PropTypes.func.isRequired,
    openListByName: PropTypes.func.isRequired,
    highlightIndex: PropTypes.number,
  };

  hightlightOnDemand(element, index) {
    if (this.props.highlightIndex === index) {
      return <strong>{element}</strong>;
    }
    return <span>{element}</span>;
  }

  processTaskText(task) {
    if (task === null) task = 'null';
    let taskTruncated = task.substring(0, restrictions.maxTaskLength),
      taskAsDisplayed = taskTruncated;

    /* If task is a link: */
    if (task.substring(0, 4) === 'http') {
      taskTruncated = taskTruncated.substr(taskTruncated.indexOf('://') + 3);
      if (taskTruncated[taskTruncated.length - 1] === '/') {
        taskTruncated = taskTruncated.substr(0, taskTruncated.length - 1);
      }
      taskAsDisplayed = (
        <a href={task} target="_blank" rel="noopener noreferrer">
          {taskTruncated}
        </a>
      );
      return taskAsDisplayed;
    }

    /* if task is a folder: */
    if (task.substring(0, 1) === '[') {
      taskAsDisplayed = (
        <span>
          <span
            className={'glyphicon glyphicon-folder-open list-first-item'}
            aria-hidden="true"
            onClick={this.props.openListByName.bind(this, task.substring(1))}
          />
          {taskTruncated.substring(1)}
        </span>
      );
    }

    return taskAsDisplayed;
  }

  displayTask(task, i, omitted) {
    if (task === CONFIG.separatorString) {
      return (
        <tr key={'tr' + i}>
          <td>
            <div className="task-row separator-row">
              <div>{CONFIG.separatorString}</div>
              <div className="right-align">{CONFIG.separatorString}</div>
            </div>
          </td>
        </tr>
      );
    }

    let itemIndex = i;
    if (itemIndex >= CONFIG.user.settings.displayListLength - CONFIG.user.settings.displayLast) {
      itemIndex = i + omitted;
    }

    let taskAsDisplayed = this.processTaskText(task);

    if (this.props.immutable) {
      return (
        <tr key={'tr' + i}>
          <td>{taskAsDisplayed}</td>
        </tr>
      );
    } else {
      return (
        <tr key={'tr' + i}>
          <td className="task-row">
            <span
              className="glyphicon glyphicon-unchecked check-button"
              aria-hidden="true"
              onClick={this.props.done.bind(this, itemIndex)}
            />
            <div className="task-description">
              <span className="task">{this.hightlightOnDemand(taskAsDisplayed, itemIndex)}</span>
            </div>
            <div>
              <span
                className="glyphicon glyphicon-trash delete-button"
                aria-hidden="true"
                onClick={this.props.delete.bind(this, itemIndex)}
              />
              <span
                className="glyphicon glyphicon-arrow-down action-button"
                aria-hidden="true"
                onClick={this.props.procrastinate.bind(this, itemIndex)}
              />
              <span
                className="glyphicon glyphicon-arrow-up action-button"
                aria-hidden="true"
                onClick={this.props.toTop.bind(this, itemIndex)}
              />
              <span
                className="glyphicon glyphicon-random action-button"
                aria-hidden="true"
                onClick={this.props.move.bind(this, task)}
              />
              <span
                className="glyphicon glyphicon-thumbs-down action-button"
                aria-hidden="true"
                onClick={this.props.postpone.bind(this, itemIndex)}
              />
            </div>
          </td>
        </tr>
      );
    }
  }

  render() {
    let taskListDisplayed = this.props.items;
    let shouldOmit = 0;

    if (!this.props.expand && Utils.overLength('displayListLength', this.props.items)) {
      shouldOmit = this.props.items.length - CONFIG.user.settings.displayListLength;
      taskListDisplayed = this.props.items
        .slice(0, CONFIG.user.settings.displayListLength - CONFIG.user.settings.displayLast - 1)
        .concat([CONFIG.separatorString])
        .concat(this.props.items.slice(-CONFIG.user.settings.displayLast));
    }

    return (
      <table className="table table-condensed table-hover">
        <tbody>{taskListDisplayed.map((task, index) => this.displayTask(task, index, shouldOmit))}</tbody>
      </table>
    );
  }
}

export default TaskList;
