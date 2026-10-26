import * as React from 'react';
import PropTypes from 'prop-types';

import CONFIG from '../config/config.js';
import * as Utils from '../utils/utils.js';
import { restrictions } from '../config/constants';
import Icon from '../shared/Icon';

interface TaskListProps {
  items: string[];
  done: (atPos: number) => void;
  delete: (atPos: number) => void;
  toTop: (fromPos: number) => void;
  move: (task: string) => void;
  procrastinate: (fromPos: number) => void;
  postpone: (fromPos: number) => void;
  openListByName: (listName: string) => void;
  highlightIndex?: number | null;
  immutable?: boolean;
  expand?: boolean;
  reloadNeeded?: boolean;
}

class TaskList extends React.Component<TaskListProps> {
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
          <Icon name="folder" className="list-first-item" onClick={this.props.openListByName.bind(this, task.substring(1))} />
          {taskTruncated.substring(1)}
        </span>
      );
    }

    return taskAsDisplayed;
  }

  displayTask(task, i, omitted) {
    if (task === CONFIG.separatorString) {
      return (
        <div className="task-row separator-row" key={'c' + i}>
          <div>{CONFIG.separatorString}</div>
          <div className="right-align">{CONFIG.separatorString}</div>
        </div>
      );
    }

    let itemIndex = i;
    if (itemIndex >= CONFIG.user.settings.displayListLength - CONFIG.user.settings.displayLast) {
      itemIndex = i + omitted;
    }

    const taskAsDisplayed = this.processTaskText(task);

    if (this.props.immutable) {
      return (
        <div className="task-card" key={'c' + i}>
          {taskAsDisplayed}
        </div>
      );
    } else {
      return (
        <div className="task-card" key={'c' + i}>
          <Icon name="circle" className="check-button" onClick={this.props.done.bind(this, itemIndex)} />
          <div className="task-description">
            <span className="task">{this.hightlightOnDemand(taskAsDisplayed, itemIndex)}</span>
          </div>
          <div className="task-card-actions">
            <Icon name="arrow-down" className="action-button" onClick={this.props.procrastinate.bind(this, itemIndex)} />
            <Icon name="arrow-up" className="action-button" onClick={this.props.toTop.bind(this, itemIndex)} />
            <Icon name="shuffle" className="action-button" onClick={this.props.move.bind(this, task)} />
            <Icon name="postpone" className="action-button" onClick={this.props.postpone.bind(this, itemIndex)} />
            <Icon name="trash" className="delete-button" onClick={this.props.delete.bind(this, itemIndex)} />
          </div>
        </div>
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

    return <div className="task-cards">{taskListDisplayed.map((task, index) => this.displayTask(task, index, shouldOmit))}</div>;
  }
}

export default TaskList;
