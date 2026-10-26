import * as React from 'react';
import PropTypes from 'prop-types';

import CONFIG from '../config/config.js';
import * as Utils from '../utils/utils.js';
import { restrictions } from '../config/constants';
import Icon from '../shared/Icon';

interface TasksDoneListProps {
  items: string[];
  undone: (atPos: number) => void;
  expand?: boolean;
}

class TasksDoneList extends React.Component<TasksDoneListProps> {
  static propTypes = {
    items: PropTypes.array.isRequired,
    expand: PropTypes.bool,
  };

  /* Display one done task */
  displayTask = (task, i) => {
    if (!this.props.expand && i < this.props.items.length - CONFIG.user.settings.displayDoneLength) {
      return null;
    }

    return (
      <div className="task-card task-card-done" key={'c' + i}>
        <Icon name="check" className="action-button" onClick={this.props.undone.bind(this, i)} />
        <span className="task-description done">{task.substring(0, restrictions.maxTaskLength)}</span>
      </div>
    );
  };

  render() {
    return (
      <div>
        {!this.props.expand && Utils.overLength('displayDoneLength', this.props.items) && CONFIG.separatorString}
        <div className="task-cards">{this.props.items.map(this.displayTask)}</div>
      </div>
    );
  }
}

export default TasksDoneList;
