import * as React from "react";
import PropTypes from 'prop-types';

import CONFIG from '../config/config.js';
import * as Utils from '../utils/utils.js';

class TasksDoneList extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    expand: PropTypes.bool,
  };

  /* Display one done task */
  displayTask = (task, i) => {
    if (!this.props.expand && i < this.props.items.length - CONFIG.user.settings.displayDoneLength) return null;
    return (
      <tr key={'tr' + i}>
        <td>
          <span
            className="glyphicon glyphicon-ok action-button"
            aria-hidden="true"
            onClick={this.props.undone.bind(this, i)}
          />
          <span className="list-item task done">{task}</span>
        </td>
      </tr>
    );
  };

  render() {
    return (
      <div>
        {!this.props.expand && Utils.overLength('displayDoneLength', this.props.items) && CONFIG.separatorString}
        <table className="table table-sm table-condensed table-hover">
          <tbody>{this.props.items.map(this.displayTask)}</tbody>
        </table>
      </div>
    );
  }
}

export default TasksDoneList;
