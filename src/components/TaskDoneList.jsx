import React, { Component } from 'react';

class TaskDoneList extends Component {

	undone(i) {
		this.props.undone(i);
	}

	displayTask(task, i) {
		return <li key={'li'+i}>
			<button onClick={this.undone.bind(this, i)}><span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
			<span className="list-item done" aria-hidden="true">
				{task}
			</span>
		</li>;
	}

	render() {
		return (
			<ul>
				{ this.props.items.map(this.displayTask.bind(this)) }
			</ul>
		);
	}
}

export default TaskDoneList;
