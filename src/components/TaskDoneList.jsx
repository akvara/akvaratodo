import React, { Component } from 'react';
import CONFIG from '../config.js';

class TaskDoneList extends Component {

	undone(i) {
		this.props.undone(i);
	}

	displayTask(task, i) {
		if (i < this.props.items.length - CONFIG.user.settings.addNewAt) return null;
		return <tr key={'tr'+i}>
			<td>
				<span className="glyphicon glyphicon-ok action-button" aria-hidden="true" onClick={this.undone.bind(this, i)}></span>
				<span className="list-item task done">
					{task}
				</span>
			</td>
		</tr>;
	}

  	/* The Renderer */
	render() {
		return (
			<div>
			{this.props.items.length > CONFIG.user.settings.addNewAt &&
				CONFIG.separatorString
			}
			<table className="table table-sm table-condensed table-hover">
				<tbody>
				{ this.props.items
						.map(this.displayTask.bind(this))
				}
				</tbody>
			</table>
			</div>
		);
	}
}

export default TaskDoneList;
