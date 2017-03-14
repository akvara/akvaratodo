import React, { Component } from 'react';

class TaskDoneList extends Component {

	undone(i) {
		this.props.undone(i);
	}

	displayTask(task, i) {
		return <tr key={'tr'+i}>
				<td>
					<span className="glyphicon glyphicon-unchecked action-button" aria-hidden="true" onClick={this.undone.bind(this, i)}></span>
					<span className="list-item task">
						{task}
					</span>
				</td>
		</tr>;
	}

	render() {
		return (
			<table className="table table-sm table-condensed table-hover">
				<tbody>
					{ this.props.items.map(this.displayTask.bind(this)) }
			</tbody>
			</table>
		);
	}
}

export default TaskDoneList;
