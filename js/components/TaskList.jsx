var TaskList = React.createClass({
	statics: {
    	separatorString: ".........."
    },

	done: function (i) {
		this.props.done(i);
	},

	delete: function (i) {
		this.props.delete(i);
	},

	move: function (i) {
		this.props.move(i);
	},

	procrastinate: function (i) {
		this.props.procrastinate(i);
	},

	postpone: function (i) {
		this.props.postpone(i);
	},

	hightlightOnDemand(element, hightlight) {
		if (hightlight) 
			return <strong>{element}</strong>;
		else
			return {element};
	},

	displayTask: function (task, i, omitted, hightlighted) {
// console.log('TaskList task', task);		
		if (task == this.constructor.separatorString) {
			return this.constructor.separatorString;
		}

		let taskTruncated = task.substring(0, this.props.config.maxTaskLength);
		let taskAsDisplayed = { taskTruncated };
		if (task.substring(0, 4) == "http") {
			taskAsDisplayed = <a href={ task } target="_blank">{ taskTruncated }</a>;
		}

		let itemIndex = i;
		if (itemIndex >= this.props.config.displayListLength - this.props.config.displayLast ) {
			itemIndex = i + omitted;
		}

		let postponeTitle = "Postpone (+" + this.props.config.postponeBy + ")";
		
		if (this.props.immutable) {
			return <li>{ taskAsDisplayed }</li>
		} else {
			return <li>
				<button title="done" onClick={this.done.bind(this, itemIndex)}>----</button>
				&nbsp;
				{ this.hightlightOnDemand(taskAsDisplayed, hightlighted) }
				&nbsp;
				<button title="Remove" onClick={this.delete.bind(this, itemIndex)}>x</button>
				<button title="Procrastinate" onClick={this.procrastinate.bind(this, itemIndex)}>v</button>
				<button title="Move to another list" onClick={this.move.bind(this, itemIndex)}>&gt;</button>
				<button title={postponeTitle} onClick={this.postpone.bind(this, itemIndex)}>p</button>
			</li>
		}
	},
	
	render: function () {
		var taskListDisplayed, 
		    shouldOmit;
// console.log('~TaskList this.props.items~', this.props.items);		
		 
		if (this.props.items.length > this.props.config.displayListLength ) {
			shouldOmit = this.props.items.length - this.props.config.displayListLength;
			taskListDisplayed =	
				this.props.items.slice(0, this.props.config.displayListLength - this.props.config.displayLast - 1)
					.concat([this.constructor.separatorString])
					.concat(this.props.items.slice(-this.props.config.displayLast));
		} else {
			shouldOmit = 0;
			taskListDisplayed =	this.props.items;
		}

		return (
			<ul>
				{taskListDisplayed.map((task, index) => this.displayTask(task, index, shouldOmit, this.props.hightlightIndex == index))}
			</ul>
		);
	}
});
