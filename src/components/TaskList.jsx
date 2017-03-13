import React, { Component } from 'react';
import CONFIG from '../config.js';

class TaskList extends Component {

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

	hightlightOnDemand(element, index) {
		if (this.props.hightlightIndex === index)
			return <strong>{element}</strong>;
		else
			return element;
	}

	displayTask(task, i, omitted) {
		if (task === CONFIG.separatorString) {
			return CONFIG.separatorString;
		}

		let taskTruncated = task.substring(0, CONFIG.maxTaskLength);
		let taskAsDisplayed = taskTruncated;
		if (task.substring(0, 4) === "http") {
			taskTruncated = taskTruncated.substr(taskTruncated.indexOf('://')+3);
			taskAsDisplayed = <a href={ task } target="_blank">{ taskTruncated }</a>;
		}

		let itemIndex = i;
		if (itemIndex >= CONFIG.displayListLength - CONFIG.displayLast ) {
			itemIndex = i + omitted;
		}

		let postponeTitle = "Postpone (+" + CONFIG.postponeBy + ")";

		if (this.props.immutable) {
			return <li key={'li'+i}>{ taskAsDisplayed }</li>
		} else {
			return <li key={'li'+i}>
				<button title="done" onClick={this.done.bind(this, itemIndex)}>
					<span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
				</button>
				<span className="task">
					{ this.hightlightOnDemand(taskAsDisplayed, itemIndex) }
				</span>
				<button title="Remove" onClick={this.delete.bind(this, itemIndex)}>x</button>
				<button title="Procrastinate" onClick={this.procrastinate.bind(this, itemIndex)}>v</button>
				<button title="To top" onClick={this.toTop.bind(this, itemIndex)}>!</button>
				<button title="Move to another list" onClick={this.move.bind(this, itemIndex)}>&gt;</button>
				<button title={postponeTitle} onClick={this.postpone.bind(this, itemIndex)}>p</button>
			</li>
		}
	}

	render() {
		var taskListDisplayed,
		    shouldOmit;

		if (this.props.items.length > CONFIG.displayListLength ) {
			shouldOmit = this.props.items.length - CONFIG.displayListLength;
			taskListDisplayed =
				this.props.items.slice(0, CONFIG.displayListLength - CONFIG.displayLast - 1)
					.concat([CONFIG.separatorString])
					.concat(this.props.items.slice(-CONFIG.displayLast));
		} else {
			shouldOmit = 0;
			taskListDisplayed =	this.props.items;
		}

		return (
			<ul>
				{taskListDisplayed.map((task, index) => this.displayTask(task, index, shouldOmit))}
			</ul>
		);
	}
}

export default TaskList;
