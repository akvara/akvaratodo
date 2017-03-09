import React, { Component } from 'react';
import config from './config.js';

class TaskList extends Component {

	static consts = {
    	separatorString: "..........",
    	// spacing: <span>&nbsp;&nbsp;&nbsp;</span>
    }

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

	hightlightOnDemand(element, hightlight) {
		if (hightlight) 
			return <strong>{element}</strong>;
		else
			return element;
	}

	displayTask(task, i, omitted, hightlighted) {
// console.log('displayTask', task);		
		if (task === this.constructor.consts.separatorString) {
			return this.constructor.consts.separatorString;
		}

		let taskTruncated = task.substring(0, config.maxTaskLength);
		let taskAsDisplayed = taskTruncated;
		if (task.substring(0, 4) === "http") {
			taskTruncated = taskTruncated.substr(taskTruncated.indexOf('://')+3);
			taskAsDisplayed = <a href={ task } target="_blank">{ taskTruncated }</a>;
		}

		let itemIndex = i;
		if (itemIndex >= config.displayListLength - config.displayLast ) {
			itemIndex = i + omitted;
		}

		let postponeTitle = "Postpone (+" + config.postponeBy + ")";

		if (this.props.immutable) {
			return <li key={'li'+i}>{ taskAsDisplayed }</li>
		} else {
			return <li key={'li'+i}>
				<button title="done" onClick={this.done.bind(this, itemIndex)}>----</button>
				&nbsp;
				{ this.hightlightOnDemand(taskAsDisplayed, hightlighted) }
				&nbsp;
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
// console.log('~TaskList items~', this.props.items);	
// console.log(consts);

		if (this.props.items.length > config.displayListLength ) {
			shouldOmit = this.props.items.length - config.displayListLength;
			taskListDisplayed =	
				this.props.items.slice(0, config.displayListLength - config.displayLast - 1)
					.concat([this.constructor.consts.separatorString])
					.concat(this.props.items.slice(-config.displayLast));
		} else {
			shouldOmit = 0;
			taskListDisplayed =	this.props.items;
		}
// console.log('~displayed~',taskListDisplayed);
		return (
			<ul>
				{taskListDisplayed.map((task, index) => this.displayTask(task, index, shouldOmit, this.props.hightlightIndex === index))}
			</ul>
		);
	}
}

export default TaskList;
