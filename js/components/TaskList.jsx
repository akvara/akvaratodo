var TaskList = React.createClass({
	statics: {
		
	},

	done: function (i) {
		this.props.done(i);
	},

	delete: function (i) {
		this.props.delete(i);
	},

	procrastinate: function (i) {
		this.props.procrastinate(i);
	},

	postpone: function (i) {
		this.props.postpone(i);
	},

	displayTask: function (task, i) {
		let taskTruncated = task.substring(0, this.props.config.maxTaskLength);
		let taskAsDisplayed = { taskTruncated };
		if (task.substring(0, 4) == "http") {
			taskAsDisplayed = <a href={ task } target="_blank">{ taskTruncated }</a>;
		}
		if (task.substring(0, 4) == "....") {
			return ".....................";
		}
		let postponeTitle = "postpone (+" + this.props.config.postponeBy + ")";
		return <li>
			<button title="done" onClick={this.done.bind(this, i)}>---</button>
			&nbsp; 
			{ taskAsDisplayed }
			&nbsp;
			<button title="remove" onClick={this.delete.bind(this, i)}>x</button>
			<button title="procrastinate" onClick={this.procrastinate.bind(this, i)}>v</button>
			<button title={postponeTitle} onClick={this.postpone.bind(this, i)}>p</button>
		</li>
	},
	
	render: function () {
		taskListDisplayed = this.props.items.slice(0, this.props.config.displayFirst);
		remainder = this.props.items.length - this.props.config.displayFirst;
		if (remainder>0) {
			taskListDisplayed = taskListDisplayed.concat("....").concat(this.props.items.slice(-Math.min(this.props.config.displayLast, remainder)));
		}

		return (
			<ul>
				{taskListDisplayed.map(this.displayTask)}
			</ul>
		);
	}
});
