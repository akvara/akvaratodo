var TaskList = React.createClass({
	statics: {
		maxTaskLength: 45
	},

	done: function(i){
		this.props.done(i);
	},

	delete: function(i){
		this.props.delete(i);
	},

	procrastinate: function(i){
		this.props.procrastinate(i);
	},

	postpone: function(i){
		this.props.postpone(i);
	},

	displayTask: function(task, i) {
		let taskString = task.substring(0, this.constructor.maxTaskLength);
		let taskDescription = { taskString };
		if (task.substring(0, 4) == "http") {
			taskDescription = <a href={ task } target="_blank">{ taskString }</a>;
		}
		
		return <li>
			<button title="done" onClick={this.done.bind(this, i)}>--</button>
			&nbsp; 
			{ taskDescription }
			&nbsp;
			<button title="remove" onClick={this.delete.bind(this, i)}>x</button>
			<button title="procrastinate" onClick={this.procrastinate.bind(this, i)}>v</button>
			<button title="postpone (+10)" onClick={this.postpone.bind(this, i)}>p</button>
		</li>
	},
	
	render: function() {

		return (
			<ul>
				{this.props.items.map(this.displayTask)}
			</ul>
		);
	}
});
