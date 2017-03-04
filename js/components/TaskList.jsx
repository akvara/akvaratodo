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
		let taskString = task.substring(0, this.props.config.maxTaskLength);
		let taskDescription = { taskString };
		if (task.substring(0, 4) == "http") {
			taskDescription = <a href={ task } target="_blank">{ taskString }</a>;
		}
		let postponeTitle = "postpone (+" + this.props.config.postponeBy + ")";
		return <li>
			<button title="done" onClick={this.done.bind(this, i)}>---</button>
			&nbsp; 
			{ taskDescription }
			&nbsp;
			<button title="remove" onClick={this.delete.bind(this, i)}>x</button>
			<button title="procrastinate" onClick={this.procrastinate.bind(this, i)}>v</button>
			<button title={postponeTitle} onClick={this.postpone.bind(this, i)}>p</button>
		</li>
	},
	
	render: function () {

		return (
			<ul>
				{this.props.items.slice(0,20).map(this.displayTask)}
			</ul>
		);
	}
});
