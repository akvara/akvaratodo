var TaskList = React.createClass({

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

	displayTask: function (task, i, omitted) {
// console.log('TaskList task', task);		
		let taskTruncated = task.substring(0, this.props.config.maxTaskLength);
		let taskAsDisplayed = { taskTruncated };
		let itemIndex = i;
		if (task.substring(0, 4) == "http") {
			taskAsDisplayed = <a href={ task } target="_blank">{ taskTruncated }</a>;
		}
		if (task.substring(0, 4) == "....") {
			return ".....................";
		}
		if (itemIndex > this.props.config.displayFirst) {
			itemIndex = i + omitted;
		}

		let postponeTitle = "Postpone (+" + this.props.config.postponeBy + ")";
		if (this.props.immutable) {
			return <li>{ taskAsDisplayed }</li>
		} else {
			return <li>
				<button title="done" onClick={this.done.bind(this, itemIndex)}>----</button>
				&nbsp; 
				{ taskAsDisplayed }
				&nbsp;
				<button title="Remove" onClick={this.delete.bind(this, itemIndex)}>x</button>
				<button title="Procrastinate" onClick={this.procrastinate.bind(this, itemIndex)}>v</button>
				<button title="Move to another list" onClick={this.move.bind(this, itemIndex)}>&gt;</button>
				<button title={postponeTitle} onClick={this.postpone.bind(this, itemIndex)}>p</button>
			</li>
		}
	},
	
	render: function () {
// console.log('~TaskList this.props.items~', this.props.items);		
		
		taskListDisplayed = this.props.items.slice(0, this.props.config.displayFirst);

		remainder = this.props.items.length - this.props.config.displayFirst;
		omitted = 0;
		if (remainder>0) {
			taskListDisplayed = taskListDisplayed.concat("....").concat(this.props.items.slice(-Math.min(this.props.config.displayLast, remainder)));
			omitted = this.props.items.length - this.props.config.displayFirst - this.props.config.displayLast - 1;
		}

		return (
			<ul>
				{taskListDisplayed.map((task, index) => this.displayTask(task, index, omitted))}
			</ul>
		);
	}
});
