import React, { Component } from 'react';

class TaskDoneList extends Component {

	undone(i) {
		this.props.undone(i);
	}

	displayTask(task, i) {
		return <li key={'li'+i}>
			{task}&nbsp;
			<button onClick={this.undone.bind(this, i)}>+</button>
		</li>;
	}

	render() {
		return (
			<ul className="done">
				{ this.props.items.map(this.displayTask.bind(this)) }
			</ul>
		);
	}
}

export default TaskDoneList;
