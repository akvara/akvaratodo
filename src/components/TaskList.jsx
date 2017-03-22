import React, { Component } from 'react';
import CONFIG from '../config.js';
import * as Utils from '../utils/utils.js';

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
			return <tr key={'tr'+i}>
				<td>{CONFIG.separatorString}</td>
				<td className="right-align">{CONFIG.separatorString}</td>
			</tr>
		}

		let taskTruncated = task.substring(0, CONFIG.maxTaskLength);
		let taskAsDisplayed = taskTruncated;
		if (task.substring(0, 4) === "http") {
			taskTruncated = taskTruncated.substr(taskTruncated.indexOf('://')+3);
			if (taskTruncated[taskTruncated.length-1] === "/") {
				taskTruncated = taskTruncated.substr(0, taskTruncated.length-1);
			}
			taskAsDisplayed = <a href={ task } target="_blank">{ taskTruncated }</a>;
		}

		let itemIndex = i;
		if (itemIndex >= CONFIG.user.settings.displayListLength - CONFIG.user.settings.displayLast ) {
			itemIndex = i + omitted;
		}

		if (this.props.immutable) {
			return <tr key={'tr'+i}><td>{ taskAsDisplayed }</td></tr>
		} else {
			return <tr key={'tr'+i}>
				<td>
					<span className="glyphicon glyphicon-unchecked action-button" aria-hidden="true" onClick={this.done.bind(this, itemIndex)}></span>
					<span className="list-item task">
						{ this.hightlightOnDemand(taskAsDisplayed, itemIndex) }
					</span>
				</td>
				<td className="actions">
					<span className="glyphicon glyphicon-trash action-button" aria-hidden="true" onClick={this.delete.bind(this, itemIndex)}></span>
					<span className="list-item">&nbsp;</span>
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
		var taskListDisplayed,
		    shouldOmit;

		if (!this.props.expand && Utils.overLength("displayListLength", this.props.items)) {
			shouldOmit = this.props.items.length - CONFIG.user.settings.displayListLength;
			taskListDisplayed =
				this.props.items.slice(0, CONFIG.user.settings.displayListLength - CONFIG.user.settings.displayLast - 1)
					.concat([CONFIG.separatorString])
					.concat(this.props.items.slice(-CONFIG.user.settings.displayLast));
		} else {
			shouldOmit = 0;
			taskListDisplayed =	this.props.items;
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
